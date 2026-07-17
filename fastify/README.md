# Fastify Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Fastify** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- Node.js >= 18

## Menjalankan

```bash
cd fastify
npm install
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm start
```

## Endpoint

`POST /webhook`

## Struktur File

```
fastify/
├── package.json
├── src/
│   └── index.js
└── README.md
```
