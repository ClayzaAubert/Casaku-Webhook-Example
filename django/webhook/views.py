"""
Casaku Webhook Receiver - Django
Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
"""

import json
import hmac
import hashlib
import logging

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def webhook(request):
    webhook_secret = getattr(settings, 'WEBHOOK_SECRET', '')
    signature = request.headers.get('X-Casaku-Signature', '')
    raw_body = request.body.decode('utf-8')

    logger.info('================ WEBHOOK RECEIVED ================')
    logger.info('Headers: %s', dict(request.headers))
    logger.info('Raw Body: %s', raw_body)

    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    logger.info('Parsed Payload: %s', payload)

    if not webhook_secret:
        return JsonResponse(
            {'error': 'WEBHOOK_SECRET is missing.'},
            status=500,
        )

    if not signature:
        logger.warning('Missing X-Casaku-Signature header')
        return JsonResponse(
            {'error': 'Unauthorized: Missing signature.'},
            status=401,
        )

    computed_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        raw_body.encode('utf-8'),
        hashlib.sha256,
    ).hexdigest()

    logger.info('Signature from Header: %s', signature)
    logger.info('Computed Signature: %s', computed_signature)

    if not hmac.compare_digest(computed_signature, signature):
        logger.warning('Invalid signature')
        return JsonResponse(
            {'error': 'Unauthorized: Invalid signature.'},
            status=401,
        )

    logger.info('Webhook Signature Verified Successfully!')
    logger.info('Final Payload: %s', payload)

    return JsonResponse({
        'success': True,
        'message': 'Webhook received and processed',
    })
