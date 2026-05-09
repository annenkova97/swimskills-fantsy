"use client";

import { useState } from "react";
import { Crown, Plus, Lock } from "lucide-react";
import type { Dict, Lang } from "../lib/i18n";
import type { Swimmer, TeamPick, Tournament, SlotType } from "../lib/types";
import { swimmers, getSwimmerName } from "../lib/swimmers";
import { SLOT_LAYOUT, teamCost, validateTeam, type TeamValidationError } from "../lib/scoring";
import { SwimmerPicker } from "./SwimmerPicker";
import { BottomSheet } from "./BottomSheet";
import { haptic } from "../lib/telegram";

export type DraftPicks = (TeamPick | null)[];

export function TeamBuilder({
  tournament,
  picks,
  setPicks,
  captainId,
  setCaptainId,
  isDirty,
  isSaved,
  onSave,
  t,
  lang,
  locked,
}: {
  tournament: Tournament;
  picks: DraftPicks;
  setPicks: (next: DraftPicks) => void;
  captainId: string | null;
  setCaptainId: (next: string | null) => void;
  isDirty: boolean;
  isSaved: boolean;
  onSave: () => void;
  t: Dict;
  lang: Lang;
  locked: boolean;
}) {
  const [pickerSlot, setPickerSlot] = useState<{ index: number; slot: SlotType } | null>(null);
  const [slotSheet, setSlotSheet] = useState<{ index: number; slot: SlotType } | null>(null);

  const compactPicks: TeamPick[] = picks
    .map((p, i) => (p ? { swimmerId: p.swimmerId, slot: SLOT_LAYOUT[i] } : null))
    .filter((p): p is TeamPick => p !== null);

  const cost = teamCost(compactPicks);
  const remaining = tournament.budget - cost;

  const errors = validateTeam(compactPicks, captainId, tournament.budget);
  const filledCount = compactPicks.length;
  const isFullyFilled = filledCount === SLOT_LAYOUT.length;
  const baseValidationOk = errors.filter(
    (e) => e !== "NO_CAPTAIN" && e !== "CAPTAIN_NOT_IN_TEAM"
  ).length === 0;
  const captainSelectionMode = isFullyFilled && baseValidationOk && !captainId && !locked;
  const isReady = errors.length === 0;

  const setPickAt = (index: number, swimmer: Swimmer) => {
    const next = [...picks];
    const previous = next[index];
    next[index] = { swimmerId: swimmer.id, slot: SLOT_LAYOUT[index] };
    setPicks(next);
    if (previous && captainId === previous.swimmerId) {
      setCaptainId(null);
    }
    haptic("light");
  };

  const removeAt = (index: number) => {
    const next = [...picks];
    const removed = next[index];
    next[index] = null;
    setPicks(next);
    if (removed && captainId === removed.swimmerId) setCaptainId(null);
    haptic("light");
  };

  const handleSlotTap = (index: number, slot: SlotType) => {
    if (locked) return;
    const pick = picks[index];

    if (!pick) {
      setPickerSlot({ index, slot });
      return;
    }

    if (captainSelectionMode) {
      setCaptainId(pick.swimmerId);
      haptic("medium");
      return;
    }

    setSlotSheet({ index, slot });
  };

  const handleSlotReplace = () => {
    if (!slotSheet) return;
    setPickerSlot({ index: slotSheet.index, slot: slotSheet.slot });
    setSlotSheet(null);
  };

  const handleSlotRemove = () => {
    if (!slotSheet) return;
    removeAt(slotSheet.index);
    setSlotSheet(null);
  };

  const handleChangeCaptain = () => {
    setCaptainId(null);
    haptic("medium");
  };

  return (
    <div>
      <div className="panel">
        <p className="kicker">{t.teamBuilder}</p>
        <h2 className="section-title" style={{ marginBottom: 6 }}>
          {tournament.shortName}
        </h2>
        <p className="muted" style={{ marginBottom: 12 }}>{t.rulesText}</p>

        <BudgetBar budget={tournament.budget} cost={cost} t={t} />
      </div>

      {captainSelectionMode && (
        <div className="captain-banner">
          <div className="captain-banner-emoji">
            <Crown size={20} />
          </div>
          <div>
            <div className="captain-banner-title">{t.captainModeTitle}</div>
            <div className="captain-banner-text">{t.captainModeText}</div>
          </div>
        </div>
      )}

      <div className={`team-grid ${captainSelectionMode ? "captain-mode" : ""}`}>
        {SLOT_LAYOUT.map((slot, i) => {
          const pick = picks[i];
          const swimmer = pick ? swimmers.find((s) => s.id === pick.swimmerId) : null;
          const isCaptain = swimmer?.id === captainId;
          const showPulse = captainSelectionMode && !!swimmer;

          return (
            <button
              type="button"
              key={i}
              className={`slot ${swimmer ? "filled" : ""} ${i < 3 ? "span-2" : ""} ${
                showPulse ? "pulse" : ""
              } ${isCaptain ? "is-captain" : ""}`}
              onClick={() => handleSlotTap(i, slot)}
              disabled={locked && !swimmer}
            >
              <div className="slot-label">
                {slot === "SPRINT"
                  ? t.slotSprint
                  : slot === "DISTANCE"
                    ? t.slotDistance
                    : slot === "UNIVERSAL"
                      ? t.slotUniversal
                      : t.slotWildcard}
              </div>

              {swimmer ? (
                <>
                  <div className="slot-name">{getSwimmerName(swimmer, lang)}</div>

                  <div className="slot-meta">
                    <span className="swimmer-tag">{swimmer.country}</span>
                    <span className={`archetype-tag ${swimmer.archetype}`}>
                      {swimmer.archetype}
                    </span>
                  </div>

                  <div className="slot-price">{swimmer.basePrice} {t.currency}</div>

                  {isCaptain && (
                    <div className="slot-captain-badge" title={t.captain}>
                      <Crown size={12} />
                      <span>×2</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="slot-empty">
                  <Plus size={28} strokeWidth={2} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!locked && !captainSelectionMode && (
        <>
          {errors.length > 0 && (
            <ul className="errors-list">
              {errors.map((e) => (
                <li key={e}>{errorMessage(e, t)}</li>
              ))}
            </ul>
          )}

          {isReady && !isDirty && isSaved && (
            <p className="success-msg">{t.saved}</p>
          )}

          {captainId && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleChangeCaptain}
              style={{ marginBottom: 10 }}
            >
              <Crown size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
              {t.captainModeChange}
            </button>
          )}

          <button
            className="btn btn-gold"
            disabled={!isReady || !isDirty}
            onClick={() => {
              if (!isReady || !isDirty) return;
              onSave();
              haptic("heavy");
            }}
          >
            {!isDirty && isSaved ? t.saved : t.saveAction}
          </button>
        </>
      )}

      {locked && (
        <div className="banner-info">
          <Lock size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
          {t.teamLocked}
        </div>
      )}

      {pickerSlot && (
        <SwimmerPicker
          slot={pickerSlot.slot}
          onPick={(s) => {
            setPickAt(pickerSlot.index, s);
            setPickerSlot(null);
          }}
          onClose={() => setPickerSlot(null)}
          selectedIds={compactPicks
            .filter((_, i) => i !== pickerSlot.index)
            .map((p) => p.swimmerId)}
          remainingBudget={
            picks[pickerSlot.index]
              ? remaining + (swimmers.find((s) => s.id === picks[pickerSlot.index]!.swimmerId)?.basePrice ?? 0)
              : remaining
          }
          participantIds={tournament.participantSwimmerIds}
          currentPickId={picks[pickerSlot.index]?.swimmerId ?? null}
          t={t}
          lang={lang}
        />
      )}

      {slotSheet && (
        <BottomSheet
          title={t.slotActionTitle}
          actions={[
            {
              key: "replace",
              label: t.slotActionReplace,
              variant: "primary",
              onSelect: handleSlotReplace,
            },
            {
              key: "remove",
              label: t.slotActionRemove,
              variant: "danger",
              onSelect: handleSlotRemove,
            },
          ]}
          onClose={() => setSlotSheet(null)}
          t={t}
        />
      )}

    </div>
  );
}

function BudgetBar({ budget, cost, t }: { budget: number; cost: number; t: Dict }) {
  const ratio = Math.min(cost / budget, 1.4);
  const over = cost > budget;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
        <span style={{ color: "var(--muted)" }}>{t.budget}</span>
        <span style={{ color: over ? "var(--danger)" : "var(--gold)" }}>
          {cost} / {budget} {t.currency}
        </span>
      </div>

      <div className="budget-bar">
        <div
          className={`budget-bar-fill ${over ? "over" : ""}`}
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>

      <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>
        {t.remaining}: {budget - cost} {t.currency}
      </div>
    </div>
  );
}

function errorMessage(e: TeamValidationError, t: Dict): string {
  switch (e) {
    case "WRONG_PICK_COUNT":
      return t.errCount;
    case "BUDGET_EXCEEDED":
      return t.errBudget;
    case "MIN_WOMEN":
      return t.errWomen;
    case "MIN_MEN":
      return t.errMen;
    case "MAX_PER_COUNTRY":
      return t.errCountry;
    case "BAD_SPRINT_SLOT":
      return t.errSprint;
    case "BAD_DISTANCE_SLOT":
      return t.errDistance;
    case "BAD_UNIVERSAL_SLOT":
      return t.errUniversal;
    case "NO_CAPTAIN":
    case "CAPTAIN_NOT_IN_TEAM":
      return t.errCaptain;
    default:
      return e;
  }
}
