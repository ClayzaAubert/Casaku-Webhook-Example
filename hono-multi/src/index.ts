/**
 * Casaku Webhook Receiver - Hono (Multi-Runtime)
 *
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 *
 * Berjalan di: Node.js, Bun, Deno, Cloudflare Workers
 * Tidak ada dependency eksternal untuk HMAC — pakai Web Crypto API.
 */

import { Hono } from 'hono';

const app = new Hono();

// Middleware-style: baca secret dari env (runtime-agnostic)
function getSecret(): string {
  // @ts-ignore - Deno
  if (typeof Deno !== 'undefined') return Deno.env.get('WEBHOOK_SECRET') || '';
  // @ts-ignore - Bun, Node, Cloudflare
  return process.env.WEBHOOK_SECRET || 'casaku_sec_ganti_dengan_secret_anda_dari_dashboard';
}

app.post('/webhook', async (c) => {
  const webhookSecret = getSecret();
  const signature = c.req.header('X-Casaku-Signature') || '';
  const rawBody = await c.req.text();

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', JSON.stringify(c.req.raw.headers));
  console.log('Raw Body:', rawBody);
  console.log('Runtime:', typeof Deno !== 'undefined' ? 'Deno'
    : typeof Bun !== 'undefined' ? 'Bun'
    : 'Node/CF');

  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(rawBody); } catch { /* ignore */ }

  if (!webhookSecret) {
    return c.json({ error: 'WEBHOOK_SECRET is missing.' }, 500);
  }

  if (!signature) {
    console.warn('Missing X-Casaku-Signature');
    return c.json({ error: 'Unauthorized: Missing signature.' }, 401);
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const isValid = await crypto.subtle.verify(
    { name: 'HMAC' },
    key,
    hexToBytes(signature),
    new TextEncoder().encode(rawBody),
  );

  if (!isValid) {
    console.warn('Invalid signature');
    return c.json({ error: 'Unauthorized: Invalid signature.' }, 401);
  }

  console.log('Webhook Signature Verified Successfully!');
  console.log('Payload:', payload);

  return c.json({ success: true, message: 'Webhook received and processed' });
});

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export default app;
