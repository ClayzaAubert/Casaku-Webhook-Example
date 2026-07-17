# Casaku Webhook Receiver - Ruby Sinatra Example
#
# Secure webhook endpoint with HMAC-SHA256 signature verification.
#
# Usage:
#   export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
#   bundle exec ruby app.rb

require "sinatra"
require "json"
require "openssl"

set :port, ENV.fetch("PORT", 8080).to_i
set :bind, "0.0.0.0"

WEBHOOK_SECRET = ENV.fetch(
  "WEBHOOK_SECRET",
  "casaku_sec_ganti_dengan_secret_anda_dari_dashboard",
)

before do
  if request.post?
    request.body.rewind
    @raw_body = request.body.read
  end
end

post "/webhook" do
  signature = request.env["HTTP_X_CASAKU_SIGNATURE"] || ""
  payload = JSON.parse(@raw_body) rescue {}

  logger.info "================ WEBHOOK RECEIVED ================"
  logger.info "Headers: #{request.env.select { |k, _| k.start_with?("HTTP_") }}"
  logger.info "Raw Body: #{@raw_body}"
  logger.info "Parsed Payload: #{payload}"

  if WEBHOOK_SECRET.empty?
    logger.error "WEBHOOK_SECRET is not configured"
    halt 500, { error: "Server misconfiguration: WEBHOOK_SECRET is missing." }.to_json
  end

  if signature.empty?
    logger.warn "Missing X-Casaku-Signature header"
    halt 401, { error: "Unauthorized: Missing signature." }.to_json
  end

  computed_signature = OpenSSL::HMAC.hexdigest(
    "SHA256",
    WEBHOOK_SECRET,
    @raw_body || "",
  )

  logger.info "Signature from Header: #{signature}"
  logger.info "Computed Signature: #{computed_signature}"

  unless secure_compare(computed_signature, signature)
    logger.warn "Invalid signature - rejecting request"
    halt 401, { error: "Unauthorized: Invalid signature." }.to_json
  end

  logger.info "Webhook Signature Verified Successfully!"
  logger.info "Final Payload: #{payload}"

  { success: true, message: "Webhook received and processed" }.to_json
end

def secure_compare(a, b)
  return false unless a.bytesize == b.bytesize

  result = 0
  a.bytes.zip(b.bytes) { |x, y| result |= x.to_i ^ y.to_i }
  result.zero?
end
