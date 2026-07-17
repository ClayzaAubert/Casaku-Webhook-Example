# Python Flask Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Python Flask** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- Python >= 3.9
- Flask

## Instalasi & Menjalankan

```bash
cd python-flask
pip install -r requirements.txt

export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
python app.py
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Struktur File

```
python-flask/
├── requirements.txt
├── app.py          # Webhook handler
└── README.md
```

## Verifikasi Signature

Menggunakan `hmac.new()` dengan `hashlib.sha256` dan `hmac.compare_digest()` untuk constant-time comparison.
