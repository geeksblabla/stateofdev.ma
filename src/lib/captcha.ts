const CLOUDFLARE_CAPTCHA_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const isCaptchaValid = async (token: string) => {
  try {
    const response = await fetch(CLOUDFLARE_CAPTCHA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        secret: import.meta.env.PUBLIC_TURNSTILE_SECRET_KEY,
        response: token
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error validating captcha:", error);
    return false;
  }
};
