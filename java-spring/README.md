# Java Spring Boot Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **Java Spring Boot** dengan verifikasi signature **HMAC-SHA256**.

## Struktur Project (Minimal)

Contoh implementasi controller:

```java
import org.springframework.web.bind.annotation.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@RestController
public class WebhookController {

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String rawBody,
            @RequestHeader("X-Casaku-Signature") String signature
    ) {
        String secret = System.getenv("WEBHOOK_SECRET");

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(keySpec);
            String computed = bytesToHex(mac.doFinal(rawBody.getBytes()));

            if (!computed.equals(signature)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid signature"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Verification failed"));
        }

        return ResponseEntity.ok(Map.of("success", true));
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
```

## Cara Menjalankan

```bash
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
./mvnw spring-boot:run
```

## Dependency (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
