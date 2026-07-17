# Cloudflare Worker Webhook Receiver (D1 + KV)

Implementasi server penerima **Webhook Casaku** menggunakan **Cloudflare Workers** dengan:

- **D1 Database** — menyimpan riwayat webhook
- **KV Namespace** — deduplikasi (cegah proses duplikat)
- **Web Crypto API** — verifikasi HMAC-SHA256 (tanpa `nodejs_compat`)
- **Auto-retry support** — selalu return 200 jika signature valid

## Prasyarat

- Node.js >= 18
- Akun Cloudflare dengan Workers, D1, dan KV
- `wrangler` CLI sudah login: `npx wrangler login`

## Setup

```bash
cd cloudflare-worker
npm install
```

### 1. Buat D1 Database

```bash
npx wrangler d1 create casaku-webhooks
```

Salin `database_id` dari output ke `wrangler.toml`.

### 2. Buat KV Namespace (opsional)

```bash
npx wrangler kv:namespace create WEBHOOK_KV
```

Salin `id` ke `wrangler.toml`.

### 3. Init Database Schema

```bash
npm run db:init
```

### 4. Set Webhook Secret

```bash
npx wrangler secret put WEBHOOK_SECRET
# Masukkan: casaku_sec_xxx...
```

### 5. Deploy

```bash
npm run deploy
```

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Struktur File

```
cloudflare-worker/
├── wrangler.toml        # Konfigurasi Worker, D1, KV
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts         # Worker utama + verifikasi HMAC
│   └── schema.sql       # D1 schema
└── README.md
```

## Endpoint

`POST /webhook` — menerima payload dari Casaku, verifikasi signature, simpan ke D1.

## Verifikasi Signature

Menggunakan **Web Crypto API** (`crypto.subtle.importKey` + `crypto.subtle.verify`) — native di Cloudflare Workers tanpa perlu `nodejs_compat`.
