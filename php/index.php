<?php
/**
 * Casaku Webhook Receiver - PHP Example
 *
 * Secure webhook endpoint with HMAC-SHA256 signature verification.
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 * 
 * Usage: php -S localhost:8080 index.php
 * Then configure your Casaku webhook to POST to http://localhost:8080/webhook
 */

$webhookSecret = getenv('WEBHOOK_SECRET') ?: 'casaku_sec_ganti_dengan_secret_anda_dari_dashboard';
$port = getenv('PORT') ?: 8080;

if (php_sapi_name() === 'cli-server') {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($uri === '/webhook' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        handleWebhook();
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }

    return;
}

/**
 * Main webhook handler
 */
function handleWebhook(): void
{
    global $webhookSecret;

    $rawBody = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_CASAKU_SIGNATURE'] ?? '';
    $payload = json_decode($rawBody, true);

    error_log("\n================ WEBHOOK RECEIVED ================");
    error_log("Headers: " . json_encode(getallheaders()));
    error_log("Raw Body: " . $rawBody);
    error_log("Parsed Payload: " . json_encode($payload));

    // === Signature Verification ===
    if (empty($webhookSecret)) {
        sendJson(500, ['error' => 'Server misconfiguration: WEBHOOK_SECRET is missing.']);
        return;
    }

    if (empty($signature)) {
        sendJson(401, ['error' => 'Unauthorized: Missing signature.']);
        return;
    }

    $computedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);

    error_log("Signature from Header: " . $signature);
    error_log("Computed Signature: " . $computedSignature);

    if (!hash_equals($computedSignature, $signature)) {
        error_log("Invalid signature - rejecting request");
        sendJson(401, ['error' => 'Unauthorized: Invalid signature.']);
        return;
    }

    error_log("Webhook Signature Verified Successfully!");
    error_log("Final Payload: " . json_encode($payload));

    sendJson(200, [
        'success' => true,
        'message' => 'Webhook received and processed',
    ]);
}

/**
 * Send JSON response
 */
function sendJson(int $statusCode, array $data): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
}
