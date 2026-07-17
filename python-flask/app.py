"""
Casaku Webhook Receiver - Python Flask Example

Secure webhook endpoint with HMAC-SHA256 signature verification.
Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer

Usage:
    export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
    python app.py
"""

import os
import hmac
import hashlib
import logging

from flask import Flask, request, jsonify

app = Flask(__name__)

WEBHOOK_SECRET = os.environ.get(
    "WEBHOOK_SECRET",
    "casaku_sec_ganti_dengan_secret_anda_dari_dashboard",
)
PORT = int(os.environ.get("PORT", 8080))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("casaku-webhook")


@app.route("/webhook", methods=["POST"])
def webhook():
    raw_body = request.get_data()
    signature = request.headers.get("X-Casaku-Signature", "")

    logger.info("================ WEBHOOK RECEIVED ================")
    logger.info("Headers: %s", dict(request.headers))
    logger.info("Raw Body: %s", raw_body.decode("utf-8", errors="replace"))
    logger.info("Parsed Payload: %s", request.get_json(silent=True))

    if not WEBHOOK_SECRET:
        logger.error("WEBHOOK_SECRET is not configured")
        return jsonify({"error": "Server misconfiguration: WEBHOOK_SECRET is missing."}), 500

    if not signature:
        logger.warning("Missing X-Casaku-Signature header")
        return jsonify({"error": "Unauthorized: Missing signature."}), 401

    computed_signature = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    logger.info("Signature from Header: %s", signature)
    logger.info("Computed Signature: %s", computed_signature)

    if not hmac.compare_digest(computed_signature, signature):
        logger.warning("Invalid signature - rejecting request")
        return jsonify({"error": "Unauthorized: Invalid signature."}), 401

    payload = request.get_json(silent=True) or {}
    logger.info("Webhook Signature Verified Successfully!")
    logger.info("Final Payload: %s", payload)

    return jsonify({"success": True, "message": "Webhook received and processed"}), 200


if __name__ == "__main__":
    logger.info("Webhook receiver starting on port %s", PORT)
    app.run(host="0.0.0.0", port=PORT)
