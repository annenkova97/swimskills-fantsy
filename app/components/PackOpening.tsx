"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { Dict, Lang } from "../lib/i18n";
import { swimmers, getSwimmerName } from "../lib/swimmers";
import { PremiumCard } from "./PremiumCard";
import { hapticNotify, useTelegramBackButton } from "../lib/telegram";

type Phase = "intro" | "shaking" | "revealed";

export function PackOpening({
  swimmerId,
  isNew,
  onClose,
  t,
  lang,
}: {
  swimmerId: string;
  isNew: boolean;
  onClose: () => void;
  t: Dict;
  lang: Lang;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const swimmer = swimmers.find((s) => s.id === swimmerId);

  useTelegramBackButton(onClose);

  useEffect(() => {
    if (phase !== "intro") return;
    const t1 = setTimeout(() => setPhase("shaking"), 700);
    const t2 = setTimeout(() => {
      setPhase("revealed");
      hapticNotify("success");
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  if (!swimmer) {
    return null;
  }

  return (
    <div className="modal-backdrop pack-modal">
      <button className="pack-close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      <div className="pack-stage">
        {phase !== "revealed" ? (
          <div className={`pack-box ${phase}`}>
            <Sparkles size={48} />
            <div className="pack-box-label">SWIM SKILLS</div>
            <div className="pack-box-sub">PREMIUM PACK</div>
          </div>
        ) : (
          <div className="pack-reveal">
            {isNew && <div className="pack-new-tag">NEW</div>}
            <PremiumCard swimmer={swimmer} lang={lang} />
            <div className="pack-name">{getSwimmerName(swimmer, lang)}</div>
            <div className="pack-meta">
              {swimmer.country} · OVR {swimmer.ovr} · {swimmer.basePrice} {t.currency}
            </div>
          </div>
        )}
      </div>

      {phase === "revealed" && (
        <button className="btn btn-gold pack-cta" onClick={onClose}>
          {t.confirm}
        </button>
      )}
    </div>
  );
}
