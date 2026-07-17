# Laravel Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Laravel** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- PHP >= 8.1
- Composer
- Laravel 11

## Setup

```bash
cd laravel
composer install
cp .env.example .env
# Edit .env: isi WEBHOOK_SECRET
php artisan serve
```

## Endpoint

`POST /webhook`

## Struktur File

```
laravel/
├── .env.example
├── config/services.php
├── routes/web.php
├── app/Http/Controllers/WebhookController.php
└── README.md
```
