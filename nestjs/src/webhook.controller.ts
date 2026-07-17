/**
 * Casaku Webhook Receiver - NestJS
 *
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 */

import {
  Controller,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Controller()
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  @Post('/webhook')
  @HttpCode(200)
  handleWebhook(
    @Headers('x-casaku-signature') signature: string,
    @Req() req: Request,
  ) {
    const webhookSecret = process.env.WEBHOOK_SECRET || '';
    const rawBody = (req as any).rawBody || '';

    this.logger.log('================ WEBHOOK RECEIVED ================');
    this.logger.log('Headers:', JSON.stringify(req.headers));

    let payload = {};
    try {
      payload = JSON.parse(rawBody);
    } catch { /* ignore */ }

    this.logger.log('Raw Body:', rawBody);
    this.logger.log('Parsed Payload:', payload);

    if (!webhookSecret) {
      throw new HttpException(
        { error: 'WEBHOOK_SECRET is missing.' },
        500,
      );
    }

    if (!signature) {
      this.logger.warn('Missing signature');
      throw new HttpException(
        { error: 'Unauthorized: Missing signature.' },
        401,
      );
    }

    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    this.logger.log(`Header sig: ${signature}`);
    this.logger.log(`Computed sig: ${computedSignature}`);

    const sigBuf = Buffer.from(signature, 'hex');
    const compBuf = Buffer.from(computedSignature, 'hex');

    let isValid = false;
    if (sigBuf.length === compBuf.length) {
      isValid = crypto.timingSafeEqual(sigBuf, compBuf);
    }

    if (!isValid) {
      this.logger.warn('Invalid signature');
      throw new HttpException(
        { error: 'Unauthorized: Invalid signature.' },
        401,
      );
    }

    this.logger.log('Webhook Verified Successfully!');
    this.logger.log('Final Payload:', payload);

    return { success: true, message: 'Webhook received and processed' };
  }
}
