import router from '@adonisjs/core/services/router';

router.post('/webhook', async ({ request, response }) => {
  const webhookSecret = process.env.WEBHOOK_SECRET || '';
  const signature = request.header('X-Casaku-Signature') || '';
  const rawBody = request.raw() || '';

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', request.headers());
  console.log('Raw Body:', rawBody);

  let payload = {};
  try { payload = JSON.parse(rawBody); } catch { /* ignore */ }

  if (!webhookSecret) {
    return response.status(500).send({ error: 'WEBHOOK_SECRET is missing.' });
  }

  if (!signature) {
    console.warn('Missing signature');
    return response.status(401).send({ error: 'Unauthorized: Missing signature.' });
  }

  const { createHmac, timingSafeEqual } = await import('node:crypto');

  const computedSignature = createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  console.log('Header sig:', signature);
  console.log('Computed sig:', computedSignature);

  const sigBuf = Buffer.from(signature, 'hex');
  const compBuf = Buffer.from(computedSignature, 'hex');

  let isValid = false;
  if (sigBuf.length === compBuf.length) {
    isValid = timingSafeEqual(sigBuf, compBuf);
  }

  if (!isValid) {
    console.warn('Invalid signature');
    return response.status(401).send({ error: 'Unauthorized: Invalid signature.' });
  }

  console.log('Webhook Verified!');
  return response.send({ success: true, message: 'Webhook received and processed' });
});
