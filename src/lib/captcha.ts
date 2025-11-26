const CLOUDFLARE_CAPTCHA_URL
  = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface CaptchaResponse {
  "success": boolean;
  "error-codes"?: string[];
  "challenge_ts"?: string;
  "hostname"?: string;
}

export async function isCaptchaValid(token: string): Promise<boolean> {
  try {
    const response = await fetch(CLOUDFLARE_CAPTCHA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        secret: String(import.meta.env.PUBLIC_TURNSTILE_SECRET_KEY ?? ""),
        response: token
      })
    });

    const data = await response.json() as CaptchaResponse;
    return data.success ?? false;
  }
  catch (error) {
    console.error("Error validating captcha:", error);
    return false;
  }
}
