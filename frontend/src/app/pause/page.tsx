"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const TRUSTED_CONTACT_KEY = "thamun_trusted_contact";

export default function PausePage() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [savedContact, setSavedContact] = useState<{ name: string; phone: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TRUSTED_CONTACT_KEY);
      if (raw) setSavedContact(JSON.parse(raw));
    } catch {
      // Ignore
    }
  }, []);

  function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const name = contactName.trim();
    const phone = contactPhone.trim();
    if (!name || name.length < 2) {
      setFormError("Please enter a trusted person's name.");
      return;
    }
    if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
      setFormError("Please enter a valid phone number (7–15 digits).");
      return;
    }
    if (!consentChecked) {
      setFormError("Please confirm that you want to save this contact on your device.");
      return;
    }

    const record = { name, phone: phone.replace(/[\s-]/g, "") };
    try {
      localStorage.setItem(TRUSTED_CONTACT_KEY, JSON.stringify(record));
      setSavedContact(record);
      setContactName("");
      setContactPhone("");
      setFormSuccess("Trusted contact saved on this device.");
    } catch {
      setFormError("Could not save contact on this device.");
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink max-w-md mx-auto border-x-2 border-ink-border px-6 py-8 flex flex-col justify-between">
      <div>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pause & Check" }]} />
        <p className="text-[16px] font-semibold text-vermilion uppercase">Pause & Check</p>
        <h1 className="mt-2 font-serif text-[36px] leading-tight font-semibold">
          Stop for 10 seconds.
        </h1>
        <ul className="mt-6 space-y-4 text-[22px] font-semibold">
          <li className="rounded-[12px] border-2 border-ink-border bg-surface p-4">
            1. Are they rushing you?
          </li>
          <li className="rounded-[12px] border-2 border-ink-border bg-surface p-4">
            2. Are they asking for a code or PIN?
          </li>
          <li className="rounded-[12px] border-2 border-ink-border bg-surface p-4">
            3. Did they ask you to keep it secret?
          </li>
        </ul>
        <p className="mt-6 text-[18px] text-muted">
          If any answer is yes: hang up right now and call someone you trust.
        </p>

        {savedContact ? (
          <div className="mt-6 rounded-[12px] border-2 border-ink-border bg-civic-green p-4 text-white">
            <p className="text-[15px] font-semibold text-marigold">Trusted contact</p>
            <p className="text-[22px] font-semibold">{savedContact.name}</p>
            <a
              href={`tel:${savedContact.phone}`}
              className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-[8px] border-2 border-ink-border bg-marigold font-semibold text-[#17201D]"
            >
              Call {savedContact.name}
            </a>
          </div>
        ) : null}

        <form onSubmit={handleSaveContact} className="mt-6 space-y-3 rounded-[12px] border-2 border-ink-border bg-surface p-4">
          <h2 className="font-serif text-[22px] font-semibold">
            {savedContact ? "Update trusted contact" : "Save a trusted contact (local only)"}
          </h2>

          {formError && (
            <div role="alert" className="rounded-[8px] border-2 border-ink-border bg-vermilion px-3 py-2 text-[15px] font-semibold text-white">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div role="status" className="rounded-[8px] border-2 border-ink-border bg-civic-green px-3 py-2 text-[15px] font-semibold text-white">
              {formSuccess}
            </div>
          )}

          <div>
            <label htmlFor="contact-name" className="block text-[15px] font-semibold">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Daughter / Son"
              className="mt-1 w-full min-h-[48px] rounded-[8px] border-2 border-ink-border bg-paper px-3 text-[17px]"
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-[15px] font-semibold">
              Phone number
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Enter phone number"
              className="mt-1 w-full min-h-[48px] rounded-[8px] border-2 border-ink-border bg-paper px-3 text-[17px]"
            />
          </div>

          <label className="flex items-start gap-3 text-[15px] text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-civic-green"
            />
            <span>I confirm this contact is stored only on my own device and never sent to any server.</span>
          </label>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-[8px] border-2 border-ink-border bg-marigold font-semibold text-[#17201D] hover:opacity-90"
          >
            Save contact
          </button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-8 flex w-full min-h-[56px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-civic-green text-[18px] font-semibold text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}
