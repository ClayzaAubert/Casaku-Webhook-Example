# AdonisJS Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **AdonisJS** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- Node.js >= 20
- AdonisJS 6

## Setup

```bash
cd adonisjs
npm install
cp .env.example .env
# Edit .env: isi WEBHOOK_SECRET
node ace serve
```

## Endpoint

`POST /webhook`

## Struktur File

```
adonisjs/
├── .env.example
├── start/routes.ts
└── README.md
```
