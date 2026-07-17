# Python FastAPI Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Python FastAPI** dengan verifikasi signature **HMAC-SHA256**.

## Persyaratan

- Python >= 3.9
- FastAPI + Uvicorn

## Instalasi & Menjalankan

```bash
cd python-fastapi
pip install -r requirements.txt

export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
uvicorn main:app --host 0.0.0.0 --port 8080
```

Server akan aktif di `http://localhost:8080` dan menerima POST di `/webhook`.

## Struktur File

```
python-fastapi/
├── requirements.txt
├── main.py         # Webhook handler (FastAPI)
└── README.md
```

## Verifikasi Signature

Menggunakan `hmac.new()` dengan `hashlib.sha256` dan `hmac.compare_digest()` untuk constant-time comparison.
