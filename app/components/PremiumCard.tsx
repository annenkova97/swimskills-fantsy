"use client";

import Image from "next/image";
import type { Lang } from "../lib/i18n";
import type { Swimmer } from "../lib/types";
import { getSwimmerName } from "../lib/swimmers";

const ATTR_LABELS = {
  start: { en: "START", ru: "СТАРТ" },
  speed: { en: "SPEED", ru: "СКОРОСТЬ" },
  power: { en: "POWER", ru: "СИЛА" },
  technique: { en: "TECHNIQUE", ru: "ТЕХНИКА" },
  endurance: { en: "ENDURANCE", ru: "ВЫНОСЛ." },
  consistency: { en: "CONSISTENCY", ru: "СТАБИЛ." },
} as const;

const COUNTRY_FLAG: Record<string, string> = {
  FRA: "🇫🇷", USA: "🇺🇸", CAN: "🇨🇦", AUS: "🇦🇺", CHN: "🇨🇳",
  ROU: "🇷🇴", HUN: "🇭🇺", ITA: "🇮🇹", GBR: "🇬🇧", GER: "🇩🇪",
  IRL: "🇮🇪", SWE: "🇸🇪", NED: "🇳🇱", NZL: "🇳🇿", ISR: "🇮🇱",
  RSA: "🇿🇦", HKG: "🇭🇰",
};

export function PremiumCard({
  swimmer,
  lang,
  size = "full",
}: {
  swimmer: Swimmer;
  lang: Lang;
  size?: "full" | "compact";
}) {
  if (swimmer.photo) {
    return <RealCard swimmer={swimmer} size={size} />;
  }
  return <PseudoCard swimmer={swimmer} lang={lang} size={size} />;
}

function RealCard({ swimmer, size }: { swimmer: Swimmer; size: "full" | "compact" }) {
  const dim = size === "full" ? { w: 330, h: 466 } : { w: 200, h: 282 };
  return (
    <div
      className="premium-card real"
      style={{ borderColor: swimmer.color, width: dim.w }}
    >
      <Image
        src={swimmer.photo!}
        alt={swimmer.name}
        width={dim.w}
        height={dim.h}
        priority
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
}

function PseudoCard({
  swimmer,
  lang,
  size,
}: {
  swimmer: Swimmer;
  lang: Lang;
  size: "full" | "compact";
}) {
  const isFull = size === "full";
  const name = getSwimmerName(swimmer, lang);
  const nameUpper = name.toUpperCase();
  const [first, ...rest] = nameUpper.split(/\s+/);
  const last = rest.join(" ");
  const flag = COUNTRY_FLAG[swimmer.country] ?? "🏳";
  const accent = swimmer.color;

  return (
    <div
      className={`premium-card pseudo ${isFull ? "full" : "compact"}`}
      style={
        {
          borderColor: accent,
          "--accent": accent,
        } as React.CSSProperties
      }
    >
      <div className="pc-bg" />

      <div className="pc-top">
        <div className="pc-ovr">
          <div className="pc-ovr-label">OVR</div>
          <div className="pc-ovr-value">{swimmer.ovr}</div>
        </div>

        <div className="pc-name">
          <div className="pc-first">{first}</div>
          {last && <div className="pc-last">{last}</div>}
          <div className="pc-tagline">DRAFT · COMPETE · DOMINATE</div>
        </div>

        <div className="pc-flag">
          <div className="pc-flag-emoji">{flag}</div>
          <div className="pc-country-code">{swimmer.country}</div>
        </div>
      </div>

      <div className="pc-photo">
        <div className="pc-monogram">{initials(swimmer.name)}</div>
        <div className="pc-archetype-watermark">{swimmer.archetype}</div>
      </div>

      {isFull && (
        <div className="pc-attrs">
          <div className="pc-attrs-title">ATTRIBUTES</div>
          {(["start", "speed", "power", "technique", "endurance", "consistency"] as const).map(
            (k) => (
              <div className="pc-attr-row" key={k}>
                <span className="pc-attr-label">{ATTR_LABELS[k][lang]}</span>
                <span className="pc-attr-bar">
                  <span
                    className="pc-attr-fill"
                    style={{ width: `${swimmer.attributes[k]}%` }}
                  />
                </span>
                <span className="pc-attr-value">{swimmer.attributes[k]}</span>
              </div>
            )
          )}
        </div>
      )}

      {isFull && (
        <div className="pc-events">
          {swimmer.events.slice(0, 4).map((ev) => (
            <span key={ev} className="pc-event-chip">
              {ev}
            </span>
          ))}
        </div>
      )}

      <div className="pc-footer">
        <span>SWIM SKILLS FANTASY LEAGUE</span>
        <span className="pc-edition">2026 EDITION</span>
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}
