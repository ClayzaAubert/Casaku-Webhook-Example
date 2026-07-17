# AWS Lambda Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **AWS Lambda** dengan **API Gateway HTTP** atau **Lambda Function URL**.

## Deploy

### 1. Buat ZIP
```bash
cd aws-lambda
zip -r function.zip index.mjs
```

### 2. Buat Lambda Function
```bash
aws lambda create-function \
  --function-name casaku-webhook \
  --runtime nodejs22.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execute
```

### 3. Set Environment Variable
```bash
aws lambda update-function-configuration \
  --function-name casaku-webhook \
  --environment Variables={WEBHOOK_SECRET=casaku_sec_xxx}
```

### 4. Integrasikan API Gateway
Buat **HTTP API** di API Gateway, integrasikan dengan Lambda, deploy ke `$default` stage.

Endpoint: `POST /webhook`

## Struktur File

```
aws-lambda/
├── index.mjs
└── README.md
```
