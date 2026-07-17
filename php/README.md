# PHP Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **PHP** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- PHP >= 8.1
- Ekstensi `hash` (bawaan PHP)

## Menjalankan Server

```bash
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
php -S localhost:8080 index.php
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Struktur File

```
php/
├── composer.json
├── index.php       # Webhook handler
└── README.md
```

## Verifikasi Signature

Menggunakan `hash_hmac('sha256', ...)` dan `hash_equals()` untuk constant-time comparison.
