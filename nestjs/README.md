# NestJS Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **NestJS** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- Node.js >= 18
- NestJS CLI (opsional)

## Menjalankan

```bash
cd nestjs
npm install
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm start
```

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Endpoint

`POST /webhook`

## Struktur File

```
nestjs/
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   └── webhook.controller.ts
└── README.md
```
