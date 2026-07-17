# Ruby Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Ruby Sinatra** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- Ruby >= 3.0
- Bundler

## Instalasi & Menjalankan

```bash
cd ruby
bundle install

export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
bundle exec ruby app.rb
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Struktur File

```
ruby/
├── Gemfile
├── app.rb          # Webhook handler (Sinatra)
└── README.md
```

## Verifikasi Signature

Menggunakan `OpenSSL::HMAC.hexdigest` dengan algoritma SHA256 dan fungsi `secure_compare` untuk constant-time comparison.
