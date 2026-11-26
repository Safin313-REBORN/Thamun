"use client";

import { useState } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[16px] font-semibold">
        {label}
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[48px] rounded-[8px] border-2 border-ink-border bg-surface px-4 text-[18px] text-ink"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="min-h-[48px] min-w-[76px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[15px] font-semibold text-ink hover:bg-marigold/20"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
