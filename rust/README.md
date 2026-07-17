# Rust Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Rust (Actix-web)** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- Rust >= 1.75 (edition 2021)

## Menjalankan Server

```bash
cd rust
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
RUST_LOG=info cargo run
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Struktur File

```
rust/
├── Cargo.toml
├── src/
│   └── main.rs     # Webhook handler (Actix-web)
└── README.md
```

## Verifikasi Signature

Menggunakan crate `hmac` + `sha2` untuk HMAC-SHA256 dan perbandingan string untuk validasi.
