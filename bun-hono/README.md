# Bun + Hono Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Bun** dan **Hono** dengan verifikasi HMAC-SHA256 via **Web Crypto API**.

## Prasyarat

- [Bun](https://bun.sh) >= 1.1

## Menjalankan

```bash
cd bun-hono
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
bun run src/index.ts
```

## Endpoint

`POST /webhook`

## Struktur File

```
bun-hono/
├── package.json
├── src/
│   └── index.ts
└── README.md
```
