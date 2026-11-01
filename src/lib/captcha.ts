const CLOUDFLARE_CAPTCHA_URL
  = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface CaptchaResponse {
  "success": boolean;
  "error-codes"?: string[];
  "challenge_ts"?: string;
  "hostname"?: string;
}

// Fail closed: captcha is required unless explicitly disabled
export async function passesCaptcha(token?: string): Promise<boolean> {
  if (import.meta.env.CAPTCHA_ENABLED === "false")
    return true;
  if (!token)
    return false;
  try {
    const response = await fetch(CLOUDFLARE_CAPTCHA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: import.meta.env.TURNSTILE_SECRET_KEY ?? "",
        response: token
      })
    });

    const data = await response.json() as CaptchaResponse;
    if (!data.success)
      console.error("Captcha rejected:", data["error-codes"]);
    return data.success ?? false;
  }
  catch (error) {
    console.error("Error validating captcha:", error);
    return false;
  }
}
