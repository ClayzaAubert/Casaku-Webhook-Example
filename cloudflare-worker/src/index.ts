/**
 * Casaku Webhook Receiver - Cloudflare Worker (D1 + KV)
 *
 * - Verifikasi HMAC-SHA256 menggunakan Web Crypto API
 * - Menyimpan payload verified ke D1 database
 * - Deduplikasi via KV (transactionId)
 * - Retry handling via 200 response cepat
 *
 * Deploy:
 *   wrangler secret put WEBHOOK_SECRET
 *   wrangler deploy
 */

export interface Env {
  WEBHOOK_SECRET: string;
  DB: D1Database;
  WEBHOOK_KV: KVNamespace;
}

interface WebhookPayload {
  transactionId: string;
  amount: number;
  packageName: string;
  appName: string;
  status: string;
  paidAt: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/webhook') {
      return new Response('Not Found', { status: 404 });
    }

    const signature = request.headers.get('X-Casaku-Signature') || '';
    const rawBody = await request.clone().text();

    console.log('================ WEBHOOK RECEIVED ================');
    console.log('Headers:', JSON.stringify([...request.headers]));
    console.log('Raw Body:', rawBody);

    // === Verifikasi Signature ===
    if (!env.WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET not configured');
      return Response.json(
        { error: 'Server misconfiguration: WEBHOOK_SECRET is missing.' },
        { status: 500 },
      );
    }

    if (!signature) {
      console.warn('Missing X-Casaku-Signature header');
      return Response.json(
        { error: 'Unauthorized: Missing signature.' },
        { status: 401 },
      );
    }

    const isValid = await verifySignature(rawBody, signature, env.WEBHOOK_SECRET);

    if (!isValid) {
      console.warn('Invalid signature - rejecting request');
      return Response.json(
        { error: 'Unauthorized: Invalid signature.' },
        { status: 401 },
      );
    }

    // Parse payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    console.log('Webhook Signature Verified Successfully!');
    console.log('Final Payload:', JSON.stringify(payload));

    // === Deduplikasi via KV (cegah proses duplikat) ===
    const dedupKey = `webhook:${payload.transactionId}`;
    const alreadyProcessed = await env.WEBHOOK_KV.get(dedupKey);

    if (alreadyProcessed) {
      console.log(`Transaction ${payload.transactionId} already processed, skipping`);
      return Response.json({
        success: true,
        message: 'Webhook already processed (duplicate ignored)',
      });
    }

    // === Simpan ke D1 Database ===
    try {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO webhooks
         (transaction_id, amount, package_name, app_name, status, paid_at, raw_payload)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          payload.transactionId,
          payload.amount,
          payload.packageName,
          payload.appName,
          payload.status,
          payload.paidAt,
          rawBody,
        )
        .run();

      // Tandai sudah diproses (TTL 1 jam)
      await env.WEBHOOK_KV.put(dedupKey, 'processed', { expirationTtl: 3600 });

      console.log(`Transaction ${payload.transactionId} saved to D1`);
    } catch (err) {
      console.error('Failed to save to D1:', err);
      // Tetap return 200 — webhook sudah valid, penyimpanan failure tidak perlu retry
    }

    return Response.json({
      success: true,
      message: 'Webhook received and processed',
    });
  },
};

/**
 * Verifikasi HMAC-SHA256 menggunakan Web Crypto API
 * (tersedia native di Cloudflare Workers, tanpa nodejs_compat)
 */
async function verifySignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const sigBytes = hexToBytes(signature);

  return crypto.subtle.verify(
    { name: 'HMAC' },
    key,
    sigBytes,
    encoder.encode(rawBody),
  );
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
