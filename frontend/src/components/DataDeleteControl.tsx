"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/ConfirmModal";

export function DataDeleteControl() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  function handleDelete() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setDeleted(true);
    } catch {
      setDeleted(false);
    }
    setConfirmOpen(false);
  }

  return (
    <div className="mt-4">
      {deleted && (
        <div role="status" className="mb-3 rounded-[8px] border-2 border-ink-border bg-civic-green px-4 py-3 text-[16px] font-semibold text-white">
          All local data on this device (theme, trusted contact, and session preferences) has been deleted.
        </div>
      )}
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="min-h-[48px] rounded-[8px] border-2 border-ink-border bg-vermilion px-5 font-semibold text-white hover:opacity-95"
      >
        Delete my local data
      </button>
      <ConfirmModal
        open={confirmOpen}
        title="Delete all local data?"
        description="This removes your saved trusted contact, theme preference, and cookie choice from this browser."
        confirmLabel="Yes, delete data"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
