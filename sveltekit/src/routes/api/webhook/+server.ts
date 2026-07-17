/**
 * Casaku Webhook Receiver - SvelteKit
 *
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 *
 * Endpoint: POST /api/webhook
 *
 * Jalankan: npm run dev
 */

import { json } from '@sveltejs/kit';
import crypto from 'crypto';

export async function POST({ request }) {
  const webhookSecret = process.env.WEBHOOK_SECRET || '';
  const signature = request.headers.get('X-Casaku-Signature') || '';
  const rawBody = await request.text();

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', [...request.headers]);
  console.log('Raw Body:', rawBody);

  let payload = {};
  try { payload = JSON.parse(rawBody); } catch { /* ignore */ }
  console.log('Parsed Payload:', payload);

  if (!webhookSecret) {
    return json({ error: 'WEBHOOK_SECRET is missing.' }, { status: 500 });
  }

  if (!signature) {
    console.warn('Missing signature');
    return json({ error: 'Unauthorized: Missing signature.' }, { status: 401 });
  }

  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  console.log('Header sig:', signature);
  console.log('Computed sig:', computedSignature);

  const sigBuf = Buffer.from(signature, 'hex');
  const compBuf = Buffer.from(computedSignature, 'hex');

  let isValid = false;
  if (sigBuf.length === compBuf.length) {
    isValid = crypto.timingSafeEqual(sigBuf, compBuf);
  }

  if (!isValid) {
    console.warn('Invalid signature');
    return json({ error: 'Unauthorized: Invalid signature.' }, { status: 401 });
  }

  console.log('Webhook Verified Successfully!');

  return json({ success: true, message: 'Webhook received and processed' });
}
