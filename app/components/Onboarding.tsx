"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Trophy } from "lucide-react";
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
      icon: <Trophy size={64} strokeWidth={1.5} />,
      title: t.onb2Title,
      text: t.onb2Text,
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

  const goTo = (target: number) => {
    const el = scrollerRef.current;
    const slideWidth = el?.querySelector<HTMLElement>(".onb-slide")?.offsetWidth ?? 0;
    el?.scrollTo({ left: target * slideWidth, behavior: "smooth" });
  };

  const next = () => {
    if (isLast) {
      onDone();
      return;
    }
    goTo(idx + 1);
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
          <button
            key={i}
            type="button"
            className={`onb-dot ${i === idx ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            <span className="onb-dot-pill" />
          </button>
        ))}
      </div>

      <div className="onb-actions">
        <button className="btn btn-gold" onClick={next}>
          {isLast ? t.onbStart : t.onbNext}
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
