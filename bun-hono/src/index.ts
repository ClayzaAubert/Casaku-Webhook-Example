/**
 * Casaku Webhook Receiver - Bun + Hono
 *
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 *
 * Fitur:
 * - Verifikasi HMAC-SHA256 via Web Crypto API
 * - Logger terstruktur
 * - Type-safe dengan TypeScript
 *
 * Jalankan: bun run src/index.ts
 */

import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono();

app.post('/webhook', async (c) => {
  const { WEBHOOK_SECRET } = env<{ WEBHOOK_SECRET: string }>(c);

  const signature = c.req.header('X-Casaku-Signature') || '';
  const rawBody = await c.req.text();

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', JSON.stringify(c.req.raw.headers));
  console.log('Raw Body:', rawBody);

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not configured');
    return c.json(
      { error: 'Server misconfiguration: WEBHOOK_SECRET is missing.' },
      500,
    );
  }

  if (!signature) {
    console.warn('Missing X-Casaku-Signature header');
    return c.json({ error: 'Unauthorized: Missing signature.' }, 401);
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const sigBytes = hexToBytes(signature);
  const isValid = await crypto.subtle.verify(
    { name: 'HMAC' },
    key,
    sigBytes,
    new TextEncoder().encode(rawBody),
  );

  if (!isValid) {
    console.warn('Invalid signature - rejecting request');
    return c.json({ error: 'Unauthorized: Invalid signature.' }, 401);
  }

  const payload = JSON.parse(rawBody);
  console.log('Webhook Signature Verified Successfully!');
  console.log('Final Payload:', JSON.stringify(payload));

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
