import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { passesCaptcha } from "./captcha";

describe("passesCaptcha", () => {
  beforeEach(() => vi.stubEnv("CAPTCHA_ENABLED", "true"));
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends secret and token as JSON to Turnstile", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "s3cret");
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ success: true })
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await passesCaptcha("tok")).toBe(true);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual({ secret: "s3cret", response: "tok" });
  });

  it("fails closed: no token is rejected when CAPTCHA_ENABLED is unset", async () => {
    vi.stubEnv("CAPTCHA_ENABLED", undefined);
    vi.stubGlobal("fetch", vi.fn());
    expect(await passesCaptcha(undefined)).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("skips the check only when CAPTCHA_ENABLED is \"false\"", async () => {
    vi.stubEnv("CAPTCHA_ENABLED", "false");
    expect(await passesCaptcha(undefined)).toBe(true);
  });

  it("returns false when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await passesCaptcha("tok")).toBe(false);
  });
});
