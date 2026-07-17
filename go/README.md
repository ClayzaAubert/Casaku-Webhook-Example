# Go Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Go** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- Go >= 1.22

## Menjalankan Server

```bash
cd go
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
go run main.go
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Struktur File

```
go/
├── go.mod
├── main.go         # Webhook handler
└── README.md
```

## Verifikasi Signature

Menggunakan `crypto/hmac` dengan `crypto/sha256` dan `hmac.Equal()` untuk constant-time comparison.
