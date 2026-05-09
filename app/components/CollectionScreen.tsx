"use client";

import { useEffect, useState } from "react";
import { Gift, Lock, Sparkles } from "lucide-react";
import type { Dict, Lang } from "../lib/i18n";
import { swimmers, getSwimmerName } from "../lib/swimmers";
import { PremiumCard } from "./PremiumCard";
import {
  loadCollection,
  saveCollection,
  packAvailable,
  timeUntilNextPack,
  markPackOpened,
  rollPackSwimmer,
  type CollectionState,
} from "../lib/collection";
import { PackOpening } from "./PackOpening";
import { haptic } from "../lib/telegram";

export function CollectionScreen({ t, lang }: { t: Dict; lang: Lang }) {
  const [state, setState] = useState<CollectionState>({ ownedIds: [] });
  const [available, setAvailable] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [opening, setOpening] = useState<{ swimmerId: string; isNew: boolean } | null>(
    null
  );

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setState(loadCollection());
    setAvailable(packAvailable());
    setCooldownMs(timeUntilNextPack());
    /* eslint-enable react-hooks/set-state-in-effect */

    const interval = setInterval(() => {
      setAvailable(packAvailable());
      setCooldownMs(timeUntilNextPack());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const openPack = () => {
    if (!available) return;
    haptic("medium");
    const id = rollPackSwimmer(state.ownedIds);
    const isNew = !state.ownedIds.includes(id);
    setOpening({ swimmerId: id, isNew });
    markPackOpened();
    setAvailable(false);
    setCooldownMs(timeUntilNextPack());
    if (isNew) {
      const next: CollectionState = { ownedIds: [...state.ownedIds, id] };
      setState(next);
      saveCollection(next);
    }
  };

  const closePack = () => setOpening(null);

  const owned = state.ownedIds
    .map((id) => swimmers.find((s) => s.id === id))
    .filter(Boolean) as typeof swimmers;
  const sortedOwned = [...owned].sort((a, b) => b.ovr - a.ovr);

  return (
    <div>
      <p className="kicker">{lang === "ru" ? "Коллекция" : "Collection"}</p>
      <h2 className="section-title">
        {lang === "ru" ? "Premium-карточки" : "Premium cards"}
      </h2>

      <div className="collection-pack">
        <div className="collection-pack-icon">
          <Gift size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="collection-pack-title">
            {lang === "ru" ? "Premium pack" : "Premium pack"}
          </div>
          <div className="collection-pack-text">
            {available
              ? lang === "ru"
                ? "Открой пак — внутри случайная карточка"
                : "Open pack — get a random card"
              : lang === "ru"
                ? `Следующий пак через ${formatCooldown(cooldownMs, lang)}`
                : `Next pack in ${formatCooldown(cooldownMs, lang)}`}
          </div>
        </div>
        <button
          className={`btn ${available ? "btn-gold" : "btn-ghost"}`}
          style={{ width: "auto", padding: "10px 14px" }}
          disabled={!available}
          onClick={openPack}
        >
          {available ? (
            <>
              <Sparkles size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
              {lang === "ru" ? "Открыть" : "Open"}
            </>
          ) : (
            <Lock size={14} />
          )}
        </button>
      </div>

      <div className="collection-stats">
        <div>
          <div className="collection-stat-value">{sortedOwned.length}</div>
          <div className="collection-stat-label">
            {lang === "ru" ? "карточек" : "cards"}
          </div>
        </div>
        <div>
          <div className="collection-stat-value">{swimmers.length}</div>
          <div className="collection-stat-label">{lang === "ru" ? "всего" : "total"}</div>
        </div>
      </div>

      {sortedOwned.length === 0 ? (
        <div className="collection-empty">
          <Sparkles size={42} color="var(--gold)" />
          <p>
            {lang === "ru"
              ? "Тут будут твои карточки. Открой первый пак выше."
              : "Your cards will appear here. Open your first pack above."}
          </p>
        </div>
      ) : (
        <div className="collection-grid">
          {sortedOwned.map((s) => (
            <div key={s.id} className="collection-cell">
              <PremiumCard swimmer={s} lang={lang} size="compact" />
              <div className="collection-cell-name">{getSwimmerName(s, lang)}</div>
            </div>
          ))}
        </div>
      )}

      {opening && (
        <PackOpening
          swimmerId={opening.swimmerId}
          isNew={opening.isNew}
          onClose={closePack}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

function formatCooldown(ms: number, lang: Lang): string {
  const hours = Math.floor(ms / 3600_000);
  const mins = Math.floor((ms % 3600_000) / 60_000);
  if (hours > 0) {
    return lang === "ru" ? `${hours} ч ${mins} мин` : `${hours}h ${mins}m`;
  }
  return lang === "ru" ? `${mins} мин` : `${mins}m`;
}
