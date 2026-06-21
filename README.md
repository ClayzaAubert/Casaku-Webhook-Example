# 📡 Casaku Webhook Receiver Example (Express.js)

Repository ini berisi contoh implementasi server penerima **Webhook Casaku** menggunakan **Express.js (Node.js)** dengan pengamanan verifikasi signature **HMAC-SHA256**.

---

## 🔒 Mengapa Verifikasi Signature Diperlukan?

Secara default, endpoint webhook terbuka untuk publik. Penyerang dapat mengirimkan request palsu (spoofing) seolah-olah pembayaran telah lunas. 

Dengan mengaktifkan **Webhook Secret** dan melakukan **verifikasi signature**, Anda dapat memastikan bahwa:
1. Payload dikirim langsung oleh server resmi **Casaku** (Autentik).
2. Payload tidak dimodifikasi di tengah jalan oleh pihak ketiga (Integritas).

---

## 🛠️ Langkah Instalasi & Persiapan

### 1. Masuk ke Direktori Project
```bash
cd webhook-example-express
```

### 2. Instal Dependency
Gunakan Node Package Manager (`npm` atau `yarn`/`bun`):
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env` di dalam root folder `webhook-example-express/` dan masukkan **Webhook Secret** dari akun Casaku Anda:

```env
PORT=8080
WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
```

> **Catatan**: Webhook Secret didapatkan melalui halaman **API Keys** di Dashboard Casaku Anda (biasanya diawali dengan `casaku_sec_`).

---

## 🚀 Menjalankan Server

Jalankan server penerima webhook:
```bash
npm start
```

Server akan aktif di port yang dikonfigurasikan (default: `8080`):
```text
🚀 Webhook receiver example listening on http://localhost:8080
📡 Send POST requests to: http://localhost:8080/webhook
```

---

## 🔍 Cara Kerja Verifikasi Signature

Saat Casaku mengirimkan request webhook ke server Anda:
1. Server Casaku membuat signature HMAC-SHA256 dari **raw request body** menggunakan `webhookSecret` Anda.
2. Signature ini dikirimkan melalui HTTP header `X-Casaku-Signature`.
3. Server Express Anda membaca raw body, menghitung ulang HMAC-SHA256 menggunakan `WEBHOOK_SECRET` lokal Anda, lalu mencocokkannya secara aman menggunakan `crypto.timingSafeEqual` (guna menghindari serangan *timing attacks*).

### Contoh Implementasi di Express (ES Modules)

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();

// Tangkap rawBody buffer (sangat penting untuk keakuratan kalkulasi signature)
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-casaku-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  // Hitung signature lokal
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody || '')
    .digest('hex');

  // Bandingkan secara constant-time
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(computedSignature, 'hex')
  );

  if (!isMatch) {
    return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
  }

  // Payload valid, proses logika bisnis Anda disini...
  res.status(200).json({ success: true });
});
```

---

## 📡 Format Payload Webhook yang Diterima

Berikut adalah format data JSON (POST) yang akan dikirimkan oleh Casaku:

```json
{
  "transactionId": "986b2a0a-5c95-4177-9800-02d84a35338e",
  "amount": 10000,
  "packageName": "id.dana",
  "appName": "DANA",
  "status": "paid",
  "paidAt": "2026-06-21T18:12:54.000Z"
}
```

---

## 🧪 Cara Pengujian Lokal (dengan Ngrok)

Agar server Casaku dapat mengirim webhook ke komputer lokal Anda:
1. Unduh dan jalankan [Ngrok](https://ngrok.com/):
   ```bash
   ngrok http 8080
   ```
2. Salin URL HTTPS forwarding dari Ngrok (misal: `https://abcd-123.ngrok-free.app`).
3. Masuk ke Dashboard Casaku Anda, buka menu profil/pengaturan webhook.
4. Masukkan URL Ngrok Anda dengan path `/webhook` ke kolom **Webhook URL**:
   `https://abcd-123.ngrok-free.app/webhook`
5. Tekan tombol **Test Webhook** di Dashboard.
6. Server lokal Anda akan menerima payload pengujian dan memverifikasi signature-nya secara real-time!
