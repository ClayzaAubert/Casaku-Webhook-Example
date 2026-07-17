use actix_web::{web, App, HttpServer, HttpRequest, HttpResponse, middleware};
use hmac::{Hmac, Mac};
use sha2::Sha256;
use log::{info, warn, error};
use std::env;

type HmacSha256 = Hmac<Sha256>;

async fn webhook(
    req: HttpRequest,
    body: web::Bytes,
) -> HttpResponse {
    let webhook_secret = env::var("WEBHOOK_SECRET")
        .unwrap_or_else(|_| "casaku_sec_ganti_dengan_secret_anda_dari_dashboard".to_string());

    let signature = req
        .headers()
        .get("X-Casaku-Signature")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    let raw_body_str = String::from_utf8_lossy(&body);

    info!("================ WEBHOOK RECEIVED ================");
    info!("Headers: {:?}", req.headers());
    info!("Raw Body: {}", raw_body_str);

    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap_or(serde_json::Value::Null);
    info!("Parsed Payload: {}", payload);

    if webhook_secret.is_empty() {
        error!("WEBHOOK_SECRET is not configured");
        return HttpResponse::InternalServerError().json(
            serde_json::json!({"error": "Server misconfiguration: WEBHOOK_SECRET is missing."})
        );
    }

    if signature.is_empty() {
        warn!("Missing X-Casaku-Signature header");
        return HttpResponse::Unauthorized().json(
            serde_json::json!({"error": "Unauthorized: Missing signature."})
        );
    }

    let mut mac = HmacSha256::new_from_slice(webhook_secret.as_bytes())
        .expect("HMAC key should be valid");

    mac.update(&body);
    let computed_signature = hex::encode(mac.finalize().into_bytes());

    info!("Signature from Header: {}", signature);
    info!("Computed Signature: {}", computed_signature);

    if computed_signature != signature {
        warn!("Invalid signature - rejecting request");
        return HttpResponse::Unauthorized().json(
            serde_json::json!({"error": "Unauthorized: Invalid signature."})
        );
    }

    info!("Webhook Signature Verified Successfully!");
    info!("Final Payload: {}", payload);

    HttpResponse::Ok().json(
        serde_json::json!({"success": true, "message": "Webhook received and processed"})
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init();

    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080);

    info!("Webhook receiver listening on http://localhost:{}", port);
    info!("Send POST requests to: http://localhost:{}/webhook", port);

    HttpServer::new(|| {
        App::new()
            .route("/webhook", web::post().to(webhook))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
