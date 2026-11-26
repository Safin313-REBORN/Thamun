const BANGLA_DIGIT_MAP: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

export function normalizeDigits(input: string): string {
  return input.replace(/[০-৯]/g, (ch) => BANGLA_DIGIT_MAP[ch] ?? ch);
}

export type GuardResult =
  | { ok: true }
  | { ok: false; reason: "pin_or_otp" | "phone" | "card" };

export function checkSensitiveInput(raw: string): GuardResult {
  const normalized = normalizeDigits(raw);

  // Bangladesh mobile numbers (+8801XXXXXXXXX or 01XXXXXXXXX)
  if (/(?:\+?880|0)1[3-9]\d{8}\b/.test(normalized)) {
    return { ok: false, reason: "phone" };
  }

  // 13-19 digit card numbers (with optional spaces/dashes)
  if (/\b(?:\d[ -]?){13,19}\b/.test(normalized)) {
    return { ok: false, reason: "card" };
  }

  // 4-6 digit PIN or OTP codes
  if (/\b\d{4,6}\b/.test(normalized)) {
    return { ok: false, reason: "pin_or_otp" };
  }

  return { ok: true };
}
