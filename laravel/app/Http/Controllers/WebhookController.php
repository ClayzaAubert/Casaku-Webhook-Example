<?php
/**
 * Casaku Webhook Receiver - Laravel
 * Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $webhookSecret = config('services.casaku.webhook_secret');
        $signature = $request->header('X-Casaku-Signature', '');
        $rawBody = $request->getContent();

        Log::info('================ WEBHOOK RECEIVED ================');
        Log::info('Headers: ' . json_encode($request->headers->all()));
        Log::info('Raw Body: ' . $rawBody);
        Log::info('Parsed Payload: ' . json_encode($request->all()));

        if (empty($webhookSecret)) {
            return response()->json(
                ['error' => 'WEBHOOK_SECRET is missing.'],
                500
            );
        }

        if (empty($signature)) {
            Log::warning('Missing X-Casaku-Signature header');
            return response()->json(
                ['error' => 'Unauthorized: Missing signature.'],
                401
            );
        }

        $computedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);

        Log::info("Signature from Header: {$signature}");
        Log::info("Computed Signature: {$computedSignature}");

        if (!hash_equals($computedSignature, $signature)) {
            Log::warning('Invalid signature');
            return response()->json(
                ['error' => 'Unauthorized: Invalid signature.'],
                401
            );
        }

        Log::info('Webhook Signature Verified Successfully!');

        return response()->json([
            'success' => true,
            'message' => 'Webhook received and processed',
        ]);
    }
}
