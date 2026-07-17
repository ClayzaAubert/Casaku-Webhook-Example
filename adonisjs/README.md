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

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Endpoint

`POST /webhook`

## Struktur File

```
adonisjs/
├── .env.example
├── start/routes.ts
└── README.md
```
