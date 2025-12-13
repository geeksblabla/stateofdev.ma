import { describe, expect, it } from "vitest";
import { getTranslation } from "./get-translation";

describe("getTranslation", () => {
  it("handles plain string in English", () => {
    expect(getTranslation("Hello", "en")).toBe("Hello");
  });

  it("handles plain string in Arabic (backward compatible)", () => {
    expect(getTranslation("Hello", "ar")).toBe("Hello");
  });

  it("returns English when lang is en", () => {
    const field = { en: "Hello", ar: "مرحبا" };
    expect(getTranslation(field, "en")).toBe("Hello");
  });

  it("returns Arabic when lang is ar and available", () => {
    const field = { en: "Hello", ar: "مرحبا" };
    expect(getTranslation(field, "ar")).toBe("مرحبا");
  });

  it("falls back to English when Arabic missing", () => {
    const field = { en: "Hello" };
    expect(getTranslation(field, "ar")).toBe("Hello");
  });

  it("falls back to English when Arabic is empty string", () => {
    const field = { en: "Hello", ar: "" };
    expect(getTranslation(field, "ar")).toBe("Hello");
  });
});
