# Next.js Webhook Receiver (App Router)

Implementasi server penerima **Webhook Casaku** menggunakan **Next.js App Router** dengan verifikasi **Web Crypto API**.

## Prasyarat

- Node.js >= 18
- Next.js >= 14

## Menjalankan

```bash
cd nextjs
npm install
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm run dev
```

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Endpoint

`POST /api/webhook`

## Deploy ke Vercel

Set environment variable `WEBHOOK_SECRET` di dashboard Vercel.

## Struktur File

```
nextjs/
├── package.json
├── src/app/api/webhook/route.ts
└── README.md
```
