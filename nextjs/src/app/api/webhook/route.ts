/**
 * Casaku Webhook Receiver - Next.js App Router
 *
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 *
 * Endpoint: POST /api/webhook
 *
 * Setup:
 *   1. Dapatkan Webhook Secret dari https://casaku.id
 *   2. Set env: WEBHOOK_SECRET=casaku_sec_xxx
 *   3. Deploy ke Vercel atau self-host
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.WEBHOOK_SECRET || '';
  const signature = request.headers.get('X-Casaku-Signature') || '';
  const rawBody = await request.text();

  console.log('================ WEBHOOK RECEIVED ================');
  console.log('Headers:', JSON.stringify([...request.headers]));
  console.log('Raw Body:', rawBody);

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'WEBHOOK_SECRET is missing.' },
      { status: 500 },
    );
  }

  if (!signature) {
    console.warn('Missing X-Casaku-Signature header');
    return NextResponse.json(
      { error: 'Unauthorized: Missing signature.' },
      { status: 401 },
    );
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const isValid = await crypto.subtle.verify(
    { name: 'HMAC' },
    key,
    hexToBytes(signature),
    encoder.encode(rawBody),
  );

  if (!isValid) {
    console.warn('Invalid signature');
    return NextResponse.json(
      { error: 'Unauthorized: Invalid signature.' },
      { status: 401 },
    );
  }

  const payload = JSON.parse(rawBody);
  console.log('Webhook Signature Verified Successfully!');
  console.log('Final Payload:', payload);

  return NextResponse.json({
    success: true,
    message: 'Webhook received and processed',
  });
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
