import type { Tournament, EventResult } from "./types";
import { swimmers } from "./swimmers";

export const tournaments: Tournament[] = [
  {
    id: "test-summer-cup-2026",
    name: "Test Summer Cup",
    shortName: "Summer Cup",
    location: "Simulation",
    startDate: "2026-05-15",
    endDate: "2026-05-22",
    deadlineAt: "2026-05-15T08:00:00Z",
    budget: 1000,
    status: "open",
    participantSwimmerIds: swimmers.map((s) => s.id),
  },
  {
    id: "european-championships-paris-2026",
    name: "European Championships Paris 2026",
    shortName: "ЧЕ Париж 2026",
    location: "Paris, France",
    startDate: "2026-07-31",
    endDate: "2026-08-16",
    deadlineAt: "2026-07-31T16:00:00Z",
    budget: 1000,
    status: "upcoming",
    participantSwimmerIds: swimmers
      .filter((s) =>
        ["FRA", "GBR", "GER", "ITA", "ROU", "HUN", "NED", "ISR", "IRL", "SWE"].includes(s.country)
      )
      .map((s) => s.id),
  },
  {
    id: "world-cup-october-2026",
    name: "World Cup",
    shortName: "World Cup 2026",
    location: "Berlin · Westmont · Singapore",
    startDate: "2026-10-10",
    endDate: "2026-11-01",
    deadlineAt: "2026-10-10T12:00:00Z",
    budget: 1000,
    status: "upcoming",
    participantSwimmerIds: swimmers.map((s) => s.id),
  },
];

export function getActiveTournament(): Tournament {
  return tournaments.find((t) => t.status === "open") ?? tournaments[0];
}

export function getTournament(id: string): Tournament | undefined {
  return tournaments.find((t) => t.id === id);
}

const SIM_SEED = 42;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function getSimulatedResults(tournamentId: string): EventResult[] {
  const tournament = getTournament(tournamentId);
  if (!tournament) return [];

  const rand = seededRandom(SIM_SEED + tournamentId.length);
  const results: EventResult[] = [];

  const eventPool = new Set<string>();
  for (const swimmerId of tournament.participantSwimmerIds) {
    const swimmer = swimmers.find((s) => s.id === swimmerId);
    if (!swimmer) continue;
    for (const event of swimmer.events) eventPool.add(event);
  }

  for (const event of eventPool) {
    const eligible = tournament.participantSwimmerIds
      .map((id) => swimmers.find((s) => s.id === id))
      .filter((s) => s && s.events.includes(event))
      .map((s) => ({
        swimmer: s!,
        score: s!.ovr + (rand() - 0.5) * 18,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    eligible.forEach((entry, idx) => {
      const place = idx + 1;
      const waPoints = Math.round(entry.score * 9.5);
      // Bonuses per brief: gold +50, silver +30, bronze +20
      const medalBonus =
        place === 1 ? 50 : place === 2 ? 30 : place === 3 ? 20 : 0;
      const isPB = rand() < 0.18;
      const pbBonus = isPB ? 10 : 0;
      // Records: WR +100, continental ER +50, national NR +25
      const isWR = place === 1 && rand() < 0.04;
      const wrBonus = isWR ? 100 : 0;
      const isER = !isWR && place === 1 && rand() < 0.08;
      const erBonus = isER ? 50 : 0;
      const isNR = !isWR && !isER && place <= 3 && rand() < 0.1;
      const nrBonus = isNR ? 25 : 0;

      const bonusPoints = medalBonus + pbBonus + wrBonus + erBonus + nrBonus;

      results.push({
        swimmerId: entry.swimmer.id,
        event,
        place,
        time: formatPlaceholderTime(event, place),
        waPoints,
        bonusPoints,
        totalFp: waPoints + bonusPoints,
      });
    });
  }

  return results;
}

function formatPlaceholderTime(event: string, place: number): string {
  const distance = parseInt(event.replace(/[^0-9]/g, ""), 10) || 100;
  const baseSeconds = (distance / 100) * 47 + place * 0.15;
  const m = Math.floor(baseSeconds / 60);
  const s = (baseSeconds % 60).toFixed(2);
  return m > 0 ? `${m}:${s.padStart(5, "0")}` : `${s}`;
}
