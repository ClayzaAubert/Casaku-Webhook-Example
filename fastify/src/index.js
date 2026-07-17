/**
 * Casaku Webhook Receiver - Fastify
 *
 * Verifikasi HMAC-SHA256 dengan raw body preservation.
 */

import Fastify from 'fastify';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({ logger: true });

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ||
  'casaku_sec_ganti_dengan_secret_anda_dari_dashboard';
const PORT = parseInt(process.env.PORT || '8080');

// Preserve raw body untuk verifikasi signature
app.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  function (_req, body, done) {
    done(null, body);
  },
);

app.post('/webhook', async (request, reply) => {
  const signature = request.headers['x-casaku-signature'] || '';
  const rawBody = request.body;

  // Parse untuk logging
  let payload = {};
  try {
    payload = JSON.parse(rawBody.toString('utf-8'));
  } catch { /* ignore */ }

  app.log.info('================ WEBHOOK RECEIVED ================');
  app.log.info('Headers: %o', request.headers);
  app.log.info('Raw Body: %s', rawBody.toString());
  app.log.info('Parsed Payload: %o', payload);

  if (!WEBHOOK_SECRET) {
    return reply.status(500).send({ error: 'WEBHOOK_SECRET is missing.' });
  }

  if (!signature) {
    app.log.warn('Missing X-Casaku-Signature header');
    return reply.status(401).send({ error: 'Unauthorized: Missing signature.' });
  }

  const computedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  app.log.info('Signature from Header: %s', signature);
  app.log.info('Computed Signature: %s', computedSignature);

  const signatureBuffer = Buffer.from(signature, 'hex');
  const computedBuffer = Buffer.from(computedSignature, 'hex');

  let isSignatureValid = false;
  if (signatureBuffer.length === computedBuffer.length) {
    isSignatureValid = crypto.timingSafeEqual(signatureBuffer, computedBuffer);
  }

  if (!isSignatureValid) {
    app.log.warn('Invalid signature');
    return reply.status(401).send({ error: 'Unauthorized: Invalid signature.' });
  }

  app.log.info('Webhook Signature Verified Successfully!');

  return { success: true, message: 'Webhook received and processed' };
});

app.listen({ port: PORT, host: '0.0.0.0' });
