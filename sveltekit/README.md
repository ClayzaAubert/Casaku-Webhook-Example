# SvelteKit Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **SvelteKit** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- Node.js >= 18
- SvelteKit

## Menjalankan

```bash
cd sveltekit
npm install
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm run dev
```

## Endpoint

`POST /api/webhook`

## Struktur File

```
sveltekit/
├── src/routes/api/webhook/+server.ts
└── README.md
```
