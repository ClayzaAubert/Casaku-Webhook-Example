import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-casaku-webhook-example'
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'webhook',
]

ROOT_URLCONF = 'casaku_webhook.urls'
WSGI_APPLICATION = 'casaku_webhook.wsgi.application'

WEBHOOK_SECRET = os.environ.get(
    'WEBHOOK_SECRET',
    'casaku_sec_ganti_dengan_secret_anda_dari_dashboard',
)

LOGGING = {
    'version': 1,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'INFO'},
}
