/**
 * Casaku Webhook Receiver - AWS Lambda (API Gateway / Function URL)
 *
 * Deploy:
 *   zip -r function.zip index.mjs
 *   aws lambda create-function --function-name casaku-webhook --runtime nodejs22.x \
 *     --handler index.handler --zip-file fileb://function.zip
 *   # Set env WEBHOOK_SECRET di Lambda console
 *   # Integrasikan dengan API Gateway HTTP atau Function URL
 */

import crypto from 'crypto';

export const handler = async (event) => {
  const webhookSecret = process.env.WEBHOOK_SECRET || '';
  const signature = event.headers['x-casaku-signature'] || '';
  const rawBody = event.body || '';

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', JSON.stringify(event.headers));
  console.log('Raw Body:', rawBody);

  let payload = {};
  try { payload = JSON.parse(rawBody); } catch { /* ignore */ }
  console.log('Parsed Payload:', payload);

  if (!webhookSecret) {
    return formatResponse(500, { error: 'WEBHOOK_SECRET is missing.' });
  }

  if (!signature) {
    console.warn('Missing X-Casaku-Signature header');
    return formatResponse(401, { error: 'Unauthorized: Missing signature.' });
  }

  // Gunakan isBase64Encoded jika API Gateway mengirim base64
  const bodyBuffer = event.isBase64Encoded
    ? Buffer.from(rawBody, 'base64')
    : Buffer.from(rawBody, 'utf-8');

  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyBuffer)
    .digest('hex');

  console.log('Signature from Header:', signature);
  console.log('Computed Signature:', computedSignature);

  const sigBuffer = Buffer.from(signature, 'hex');
  const compBuffer = Buffer.from(computedSignature, 'hex');

  let isValid = false;
  if (sigBuffer.length === compBuffer.length) {
    isValid = crypto.timingSafeEqual(sigBuffer, compBuffer);
  }

  if (!isValid) {
    console.warn('Invalid signature');
    return formatResponse(401, { error: 'Unauthorized: Invalid signature.' });
  }

  console.log('Webhook Signature Verified Successfully!');
  console.log('Final Payload:', payload);

  return formatResponse(200, {
    success: true,
    message: 'Webhook received and processed',
  });
};

function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
