# Deno + Oak Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Deno** dan **Oak** dengan verifikasi **Web Crypto API**.

## Prasyarat

- [Deno](https://deno.com) >= 1.40

## Menjalankan

```bash
cd deno-oak
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
deno run --allow-net --allow-env app.ts
```

## Endpoint

`POST /webhook`

## Struktur File

```
deno-oak/
├── app.ts
└── README.md
```
