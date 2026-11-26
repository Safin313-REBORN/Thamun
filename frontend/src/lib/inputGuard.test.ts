import { describe, expect, it } from "vitest";
import { checkSensitiveInput, normalizeDigits } from "./inputGuard";

describe("inputGuard", () => {
  it("normalizes Bangla digits", () => {
    expect(normalizeDigits("১২৩৪")).toBe("1234");
  });

  it("blocks 4-6 digit PIN/OTP in English and Bangla", () => {
    expect(checkSensitiveInput("My PIN is 4829")).toEqual({ ok: false, reason: "pin_or_otp" });
    expect(checkSensitiveInput("আমার কোড ১২৩৪৫৬")).toEqual({ ok: false, reason: "pin_or_otp" });
  });

  it("blocks Bangladesh mobile numbers", () => {
    expect(checkSensitiveInput("Call 01712345678")).toEqual({ ok: false, reason: "phone" });
    expect(checkSensitiveInput("+8801812345678")).toEqual({ ok: false, reason: "phone" });
  });

  it("blocks card numbers", () => {
    expect(checkSensitiveInput("4532 1234 5678 9012")).toEqual({ ok: false, reason: "card" });
  });

  it("allows safe conversational replies", () => {
    expect(checkSensitiveInput("Why will my account close in 10 minutes?")).toEqual({ ok: true });
    expect(checkSensitiveInput("কেন বন্ধ হবে? আমি কোনো কোড দেবো না।")).toEqual({ ok: true });
  });
});
