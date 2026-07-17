# Express.js Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Express.js (Node.js)** dengan verifikasi signature **HMAC-SHA256**.

## Prasyarat

- Node.js >= 18
- npm / yarn / bun

## Instalasi & Menjalankan

```bash
cd express-node
npm install

# Set Webhook Secret
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard

# Jalankan server
npm start
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `PORT` | `8080` | Port server |
| `WEBHOOK_SECRET` | `casaku_sec_...` | Secret dari Dashboard Casaku |

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**. Secret ini diperlukan untuk verifikasi signature HMAC-SHA256.

## Endpoint

`POST /webhook`

## Struktur File

```
express-node/
├── package.json
├── index.js        # Webhook handler
└── README.md
```

## Verifikasi Signature

Menggunakan `crypto.createHmac('sha256')` dan `crypto.timingSafeEqual()` untuk constant-time comparison.

## Payload

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
