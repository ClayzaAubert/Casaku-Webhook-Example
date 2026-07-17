# Hono Multi-Runtime Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Hono** — berjalan di **Node.js**, **Bun**, **Deno**, dan **Cloudflare Workers**.

## Menjalankan

### Node.js
```bash
cd hono-multi
npm install
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm run dev:node
```

### Bun
```bash
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm run dev:bun
```

### Deno
```bash
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm run dev:deno
```

### Cloudflare Workers
```bash
npx wrangler deploy src/index.ts
```

## Struktur File

```
hono-multi/
├── package.json
├── src/
│   └── index.ts
└── README.md
```
