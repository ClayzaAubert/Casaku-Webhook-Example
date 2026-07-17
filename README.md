# Casaku Webhook Example

Kumpulan contoh implementasi server penerima **Webhook Casaku** dengan verifikasi signature **HMAC-SHA256** di berbagai bahasa dan platform.

> **Webhook Callback** — Notifikasi otomatis saat transaksi lunas. Casaku mengirim `HTTP POST` ke URL webhook Anda dalam hitungan detik setelah transaksi terverifikasi lunas. Setiap payload ditandatangani dengan **HMAC-SHA256** menggunakan **Webhook Secret** Anda. Retry otomatis hingga **3 kali** jika server tidak merespons dalam **10 detik**.

## Daftar Implementasi

### Node.js / JavaScript / TypeScript

| Framework | Folder | Runtime |
|-----------|--------|---------|
| **Express.js** | [express-node](./express-node/) | Node.js |
| **Fastify** | [fastify](./fastify/) | Node.js |
| **NestJS** | [nestjs](./nestjs/) | Node.js |
| **AdonisJS** | [adonisjs](./adonisjs/) | Node.js |
| **Hono** | [hono-multi](./hono-multi/) | Node / Bun / Deno / CF Workers |
| **Next.js** (App Router) | [nextjs](./nextjs/) | Node.js / Vercel |
| **SvelteKit** | [sveltekit](./sveltekit/) | Node.js |

### Bun

| Framework | Folder |
|-----------|--------|
| **Bun + Hono** | [bun-hono](./bun-hono/) |

### Deno

| Framework | Folder |
|-----------|--------|
| **Deno + Oak** | [deno-oak](./deno-oak/) |

### Python

| Framework | Folder |
|-----------|--------|
| **Flask** | [python-flask](./python-flask/) |
| **FastAPI** | [python-fastapi](./python-fastapi/) |
| **Django** | [django](./django/) |

### PHP

| Framework | Folder |
|-----------|--------|
| **PHP Native** | [php](./php/) |
| **Laravel** | [laravel](./laravel/) |

### Go

| Framework | Folder |
|-----------|--------|
| **Go Native** | [go](./go/) |

### Ruby

| Framework | Folder |
|-----------|--------|
| **Sinatra** | [ruby](./ruby/) |

### Rust

| Framework | Folder |
|-----------|--------|
| **Actix-web** | [rust](./rust/) |

### Java / C#

| Platform | Folder |
|----------|--------|
| **Java Spring Boot** | [java-spring](./java-spring/) |
| **C# .NET Core** | [dotnet](./dotnet/) |

### Serverless / Edge

| Platform | Folder | Catatan |
|----------|--------|---------|
| **Cloudflare Workers** (D1 + KV) | [cloudflare-worker](./cloudflare-worker/) | Dengan D1 database & KV dedup |
| **AWS Lambda** | [aws-lambda](./aws-lambda/) | API Gateway / Function URL |

---

## Struktur Payload Webhook

Casaku mengirim `POST` ke webhook URL Anda dengan format JSON:

```
POST /webhook HTTP/1.1
Host: your-server.com
Content-Type: application/json
X-Casaku-Signature: <HMAC-SHA256 hex>
```

| Field | Type | Deskripsi |
|-------|------|-----------|
| `transactionId` | String | ID unik transaksi |
| `amount` | Number | Nominal total transaksi |
| `packageName` | String | Package ID aplikasi pengirim |
| `appName` | String | Nama tampilan aplikasi pengirim |
| `status` | String | `"paid"` — status transaksi terverifikasi lunas |
| `paidAt` | String | Timestamp ISO 8601 saat pembayaran selesai |

```json
{
  "transactionId": "TX987654321",
  "amount": 55000,
  "packageName": "com.company.paymentapp",
  "appName": "Payment App Name",
  "status": "paid",
  "paidAt": "2026-06-04T03:38:35Z"
}
```

## Signature Verification

Verifikasi keaslian webhook dengan **HMAC-SHA256**:

1. **Ambil header signature** — Baca nilai header `X-Casaku-Signature` dari request masuk.
2. **Gunakan raw body** — Ambil body **sebelum di-parse**. Parsing JSON mengubah urutan key sehingga signature tidak cocok.
3. **Hitung HMAC-SHA256** — Kalkulasikan HMAC-SHA256 menggunakan **raw body** sebagai message dan **Webhook Secret** sebagai key.
4. **Bandingkan constant-time** — Gunakan `timingSafeEqual` (Node.js), `hash_equals` (PHP), `hmac.compare_digest` (Python), `hmac.Equal` (Go), atau `crypto.subtle.verify` (Web Crypto). Jangan gunakan `==` biasa (rentan timing attack).

## Pengujian Lokal dengan Ngrok

```bash
# Pilih salah satu contoh, misal Express:
cd express-node
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
npm start

# Terminal terpisah:
ngrok http 8080
# Dapatkan URL: https://xxxx.ngrok-free.app/webhook
# Daftarkan di Dashboard Casaku -> Webhook Developer
```

## Struktur Repository

```
webhook-example/
├── README.md
├── express-node/          # Node.js Express
├── fastify/               # Node.js Fastify
├── nestjs/                # Node.js NestJS
├── adonisjs/              # Node.js AdonisJS
├── nextjs/                # Next.js App Router
├── sveltekit/             # SvelteKit
├── bun-hono/              # Bun + Hono
├── deno-oak/              # Deno + Oak
├── hono-multi/            # Hono (multi-runtime)
├── python-flask/          # Python Flask
├── python-fastapi/        # Python FastAPI
├── django/                # Python Django
├── php/                   # PHP Native
├── laravel/               # PHP Laravel
├── go/                    # Go Native
├── ruby/                  # Ruby Sinatra
├── rust/                  # Rust Actix-web
├── java-spring/           # Java Spring Boot
├── dotnet/                # C# .NET Core
├── cloudflare-worker/     # Cloudflare Workers (D1 + KV)
└── aws-lambda/            # AWS Lambda
```
