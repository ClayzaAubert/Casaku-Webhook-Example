// Casaku Webhook Receiver - Go Example
//
// Secure webhook endpoint with HMAC-SHA256 signature verification.
// Webhook Secret didapatkan dari https://casaku.id → Dashboard → Webhook Developer

package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

var webhookSecret string

func main() {
	webhookSecret = os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		webhookSecret = "casaku_sec_ganti_dengan_secret_anda_dari_dashboard"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/webhook", webhookHandler)

	log.Printf("Webhook receiver listening on http://localhost:%s", port)
	log.Printf("Send POST requests to: http://localhost:%s/webhook", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	rawBody, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, `{"error":"Failed to read body"}`, http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	signature := r.Header.Get("X-Casaku-Signature")

	log.Println("================ WEBHOOK RECEIVED ================")
	log.Printf("Headers: %v", r.Header)
	log.Printf("Raw Body: %s", string(rawBody))

	var payload map[string]interface{}
	json.Unmarshal(rawBody, &payload)
	log.Printf("Parsed Payload: %v", payload)

	// Verification
	if webhookSecret == "" {
		log.Println("WEBHOOK_SECRET is not configured")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Server misconfiguration: WEBHOOK_SECRET is missing."})
		return
	}

	if signature == "" {
		log.Println("Missing X-Casaku-Signature header")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: Missing signature."})
		return
	}

	mac := hmac.New(sha256.New, []byte(webhookSecret))
	mac.Write(rawBody)
	computedSignature := hex.EncodeToString(mac.Sum(nil))

	log.Printf("Signature from Header: %s", signature)
	log.Printf("Computed Signature: %s", computedSignature)

	if !hmac.Equal([]byte(signature), []byte(computedSignature)) {
		log.Println("Invalid signature - rejecting request")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: Invalid signature."})
		return
	}

	log.Printf("Webhook Signature Verified Successfully!")
	log.Printf("Final Payload: %v", payload)

	fmt.Fprintf(w, `{"success":true,"message":"Webhook received and processed"}`)
}
