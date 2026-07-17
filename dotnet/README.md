# .NET (C#) Webhook Receiver Example

Implementasi server penerima **Webhook Casaku** menggunakan **ASP.NET Core (C#)** dengan verifikasi signature **HMAC-SHA256**.

## Struktur Project (Minimal)

Contoh implementasi controller:

```csharp
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class WebhookController : ControllerBase
{
    [HttpPost]
    public IActionResult HandleWebhook()
    {
        var signature = Request.Headers["X-Casaku-Signature"].FirstOrDefault() ?? "";
        var secret = Environment.GetEnvironmentVariable("WEBHOOK_SECRET") ?? "";

        using var reader = new StreamReader(Request.Body);
        var rawBody = reader.ReadToEnd();

        var keyBytes = System.Text.Encoding.UTF8.GetBytes(secret);
        var bodyBytes = System.Text.Encoding.UTF8.GetBytes(rawBody);

        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(bodyBytes);
        var computed = Convert.ToHexString(hash).ToLower();

        if (!computed.Equals(signature, StringComparison.OrdinalIgnoreCase))
        {
            return Unauthorized(new { error = "Invalid signature" });
        }

        return Ok(new { success = true, message = "Webhook received and processed" });
    }
}
```

## Webhook Secret

Dapatkan **Webhook Secret** dari **[Dashboard Casaku](https://casaku.id)** → menu **Webhook Developer** / **API Keys**.

## Cara Menjalankan

```bash
export WEBHOOK_SECRET=casaku_sec_ganti_dengan_secret_anda_dari_dashboard
dotnet run
```
