# Django Webhook Receiver

Implementasi server penerima **Webhook Casaku** menggunakan **Django** dengan verifikasi **HMAC-SHA256**.

## Prasyarat

- Python >= 3.9
- Django >= 5.0

## Setup

```bash
cd django
pip install -r requirements.txt
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
python manage.py runserver 0.0.0.0:8080
```

## Endpoint

`POST /webhook/`

## Struktur File

```
django/
├── manage.py
├── requirements.txt
├── casaku_webhook/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── webhook/
│   ├── __init__.py
│   ├── apps.py
│   ├── urls.py
│   └── views.py
└── README.md
```
