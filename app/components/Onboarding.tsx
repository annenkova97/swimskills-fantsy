"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Crown, Trophy } from "lucide-react";
import type { Dict } from "../lib/i18n";
import { haptic } from "../lib/telegram";

export function Onboarding({ t, onDone }: { t: Dict; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const slides = [
    {
      icon: <Users size={64} strokeWidth={1.5} />,
      title: t.onb1Title,
      text: t.onb1Text,
    },
    {
      icon: <Crown size={64} strokeWidth={1.5} />,
      title: t.onb2Title,
      text: t.onb2Text,
    },
    {
      icon: <Trophy size={64} strokeWidth={1.5} />,
      title: t.onb3Title,
      text: t.onb3Text,
    },
  ];

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const slideWidth = el.querySelector<HTMLElement>(".onb-slide")?.offsetWidth ?? 1;
    const next = Math.round(el.scrollLeft / slideWidth);
    if (next !== idx) setIdx(next);
  };

  useEffect(() => {
    haptic("light");
  }, [idx]);

  const isLast = idx === slides.length - 1;

  const next = () => {
    if (isLast) {
      onDone();
      return;
    }
    const el = scrollerRef.current;
    const slideWidth = el?.querySelector<HTMLElement>(".onb-slide")?.offsetWidth ?? 0;
    el?.scrollTo({ left: (idx + 1) * slideWidth, behavior: "smooth" });
  };

  return (
    <div className="onboarding">
      <div className="onb-brand">
        <div className="onb-brand-name">Swim Skills</div>
        <div className="onb-brand-sub">Fantasy League</div>
      </div>

      <div className="onb-scroller" ref={scrollerRef} onScroll={onScroll}>
        {slides.map((s, i) => (
          <div className="onb-slide" key={i}>
            <div className="onb-icon">{s.icon}</div>
            <h2 className="onb-title">{s.title}</h2>
            <p className="onb-text">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="onb-dots">
        {slides.map((_, i) => (
          <span key={i} className={`onb-dot ${i === idx ? "active" : ""}`} />
        ))}
      </div>

      <div className="onb-actions">
        <button className="btn btn-gold" onClick={next}>
          {isLast ? t.onbStart : t.start}
        </button>
        {!isLast && (
          <button className="btn btn-ghost" onClick={onDone}>
            {t.onbSkip}
          </button>
        )}
      </div>
    </div>
  );
}
