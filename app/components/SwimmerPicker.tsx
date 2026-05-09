"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Dict, Lang } from "../lib/i18n";
import type { SlotType, Swimmer } from "../lib/types";
import { swimmers, getSwimmerName } from "../lib/swimmers";
import { PremiumCard } from "./PremiumCard";
import { haptic, useTelegramBackButton } from "../lib/telegram";

type Filter = "ALL" | "SPRINT" | "DISTANCE" | "UNIVERSAL" | "F" | "M";

export function SwimmerPicker({
  slot,
  onPick,
  onClose,
  selectedIds,
  remainingBudget,
  participantIds,
  currentPickId,
  t,
  lang,
}: {
  slot: SlotType;
  onPick: (swimmer: Swimmer) => void;
  onClose: () => void;
  selectedIds: string[];
  remainingBudget: number;
  participantIds: string[];
  currentPickId?: string | null;
  t: Dict;
  lang: Lang;
}) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useTelegramBackButton(onClose);

  const filtered = useMemo(() => {
    const inTournament = swimmers.filter((s) => participantIds.includes(s.id));
    let pool = inTournament;
    if (slot === "SPRINT") pool = pool.filter((s) => s.archetype === "SPRINT");
    if (slot === "DISTANCE") pool = pool.filter((s) => s.archetype === "DISTANCE");
    if (slot === "UNIVERSAL") pool = pool.filter((s) => s.archetype === "UNIVERSAL");

    if (filter === "SPRINT") pool = pool.filter((s) => s.archetype === "SPRINT");
    if (filter === "DISTANCE") pool = pool.filter((s) => s.archetype === "DISTANCE");
    if (filter === "UNIVERSAL") pool = pool.filter((s) => s.archetype === "UNIVERSAL");
    if (filter === "F") pool = pool.filter((s) => s.gender === "F");
    if (filter === "M") pool = pool.filter((s) => s.gender === "M");

    const sorted = [...pool].sort((a, b) => b.basePrice - a.basePrice);

    if (currentPickId) {
      const idx = sorted.findIndex((s) => s.id === currentPickId);
      if (idx > 0) {
        const [current] = sorted.splice(idx, 1);
        sorted.unshift(current);
      }
    }

    return sorted;
  }, [filter, slot, participantIds, currentPickId]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIdx(0);
  }, [filter]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(".picker-slide")?.offsetWidth ?? 1;
    const gap = 14;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  const slotTitle =
    slot === "SPRINT"
      ? t.slotSprint
      : slot === "DISTANCE"
        ? t.slotDistance
        : slot === "UNIVERSAL"
          ? t.slotUniversal
          : t.slotWildcard;

  const showFilters = slot === "WILDCARD";

  const tryPick = (s: Swimmer) => {
    if (s.id === currentPickId) {
      onClose();
      return;
    }
    if (selectedIds.includes(s.id)) return;
    if (s.basePrice > remainingBudget && s.id !== currentPickId) return;
    haptic("medium");
    onPick(s);
  };

  return (
    <div className="modal-backdrop picker">
      <div className="modal-header">
        <div>
          <h3 className="modal-title">{slotTitle}</h3>
          <div className="picker-count">
            {filtered.length > 0 ? `${activeIdx + 1} / ${filtered.length}` : "—"}
          </div>
        </div>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>
      </div>

      {showFilters && (
        <div className="filter-row picker-filters">
          {(
            [
              ["ALL", t.filterAll],
              ["SPRINT", t.filterSprint],
              ["DISTANCE", t.filterDistance],
              ["UNIVERSAL", t.filterUniversal],
              ["F", t.filterWomen],
              ["M", t.filterMen],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              className={`filter-chip ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="picker-empty">—</div>
      ) : (
        <>
          <div className="picker-scroller" ref={scrollerRef} onScroll={onScroll}>
            {filtered.map((s) => {
              const isCurrent = s.id === currentPickId;
              const isSelectedElsewhere = !isCurrent && selectedIds.includes(s.id);
              const overBudget = !isCurrent && s.basePrice > remainingBudget;
              const disabled = isSelectedElsewhere || overBudget;

              return (
                <div className="picker-slide" key={s.id}>
                  <button
                    className={`picker-card-btn ${isCurrent ? "current" : ""} ${disabled ? "disabled" : ""}`}
                    onClick={() => tryPick(s)}
                    aria-label={`Pick ${s.name}`}
                  >
                    <PremiumCard swimmer={s} lang={lang} />

                    {isCurrent && (
                      <span className="picker-current-badge">{t.current}</span>
                    )}
                    {isSelectedElsewhere && (
                      <span className="picker-overlay">{t.selected}</span>
                    )}
                    {overBudget && !isSelectedElsewhere && (
                      <span className="picker-overlay over-budget">
                        <AlertTriangle size={14} /> {t.errBudget}
                      </span>
                    )}
                  </button>

                  <div className="picker-meta">
                    <div className="picker-name">{getSwimmerName(s, lang)}</div>
                    <div className="picker-price">
                      {s.basePrice} <span>{t.currency}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="picker-footer">
            <span className="picker-hint">{t.swipeHint}</span>
            <span className="picker-pick-hint">{t.pickThisCard}</span>
          </div>
        </>
      )}
    </div>
  );
}
