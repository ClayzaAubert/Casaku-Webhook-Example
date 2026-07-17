import { NestFactory } from '@nestjs/core';
import { Module, Controller } from '@nestjs/common';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [WebhookController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Preserve raw body untuk verifikasi signature
    rawBody: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Webhook receiver on http://localhost:${port}`);
}
bootstrap();
