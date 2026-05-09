"use client";

import { useEffect } from "react";
import type { Dict } from "../lib/i18n";
import { useTelegramBackButton } from "../lib/telegram";

export type SheetAction = {
  key: string;
  label: string;
  variant?: "default" | "danger" | "primary";
  onSelect: () => void;
};

export function BottomSheet({
  title,
  text,
  actions,
  onClose,
  t,
}: {
  title: string;
  text?: string;
  actions: SheetAction[];
  onClose: () => void;
  t: Dict;
}) {
  useTelegramBackButton(onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-grabber" />
        <h3 className="sheet-title">{title}</h3>
        {text && <p className="sheet-text">{text}</p>}

        <div className="sheet-actions">
          {actions.map((a) => (
            <button
              key={a.key}
              className={`sheet-btn ${a.variant ?? "default"}`}
              onClick={() => {
                a.onSelect();
              }}
            >
              {a.label}
            </button>
          ))}

          <button className="sheet-btn cancel" onClick={onClose}>
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
