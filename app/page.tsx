"use client";

import { useEffect, useMemo, useState } from "react";
import { dictionary, detectLang, type Lang } from "./lib/i18n";
import { initTelegram, getTelegram, useTelegramMainButton, haptic } from "./lib/telegram";
import { getActiveTournament, tournaments } from "./lib/tournaments";
import { loadTeamFor, saveTeam, loadUser, saveUser, type StoredUser } from "./lib/storage";
import type { Team, TeamPick } from "./lib/types";
import { buildLeaderboard } from "./lib/leaderboard";
import { SLOT_LAYOUT, validateTeam, teamCost } from "./lib/scoring";
import { BottomNav, type Tab } from "./components/BottomNav";
import { Topbar } from "./components/Topbar";
import { TournamentScreen } from "./components/TournamentScreen";
import { TeamBuilder, type DraftPicks } from "./components/TeamBuilder";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { BottomSheet } from "./components/BottomSheet";
import { Onboarding } from "./components/Onboarding";

type HydratedState = {
  lang: Lang;
  user: StoredUser;
  team: Team | null;
  draftPicks: DraftPicks;
  draftCaptainId: string | null;
  isSaved: boolean;
  onboardingDone: boolean;
};

const ONBOARDING_KEY = "ss-fantasy.onboarding.v2";

function picksFromTeam(team: Team | null): DraftPicks {
  if (!team) return SLOT_LAYOUT.map(() => null);
  const result: DraftPicks = SLOT_LAYOUT.map(() => null);
  team.picks.forEach((p) => {
    const idx = result.findIndex((r, i) => r === null && SLOT_LAYOUT[i] === p.slot);
    if (idx >= 0) result[idx] = p;
  });
  return result;
}

function picksToCompact(picks: DraftPicks): TeamPick[] {
  return picks
    .map((p, i) => (p ? { swimmerId: p.swimmerId, slot: SLOT_LAYOUT[i] } : null))
    .filter((p): p is TeamPick => p !== null);
}

function arePicksEqual(a: DraftPicks, b: DraftPicks): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (!ai && !bi) continue;
    if (!ai || !bi) return false;
    if (ai.swimmerId !== bi.swimmerId) return false;
  }
  return true;
}

export default function Home() {
  const [hydrated, setHydrated] = useState<HydratedState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("tournament");
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  const tournament = useMemo(() => getActiveTournament(), []);

  useEffect(() => {
    const tgUser = initTelegram();
    const stored = loadUser();
    const id =
      stored?.id ??
      (tgUser?.id ? `tg-${tgUser.id}` : `local-${Math.random().toString(36).slice(2, 10)}`);
    const username = tgUser?.username
      ? `@${tgUser.username}`
      : (stored?.username ?? "@you");

    const newUser: StoredUser = {
      id,
      username,
      photoUrl: tgUser?.photo_url ?? stored?.photoUrl,
      langOverride: stored?.langOverride,
    };
    saveUser(newUser);

    const team = loadTeamFor(tournament.id);
    const onboardingDone =
      typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEY) === "1";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated({
      lang: newUser.langOverride ?? detectLang(),
      user: newUser,
      team,
      draftPicks: picksFromTeam(team),
      draftCaptainId: team?.captainId ?? null,
      isSaved: !!team,
      onboardingDone,
    });
  }, [tournament.id]);

  const lang: Lang = hydrated?.lang ?? "ru";
  const user = hydrated?.user ?? null;
  const team = hydrated?.team ?? null;
  const draftPicks = hydrated?.draftPicks ?? SLOT_LAYOUT.map(() => null);
  const draftCaptainId = hydrated?.draftCaptainId ?? null;
  const isSaved = hydrated?.isSaved ?? false;
  const t = dictionary[lang];

  const setLang = (next: Lang) => {
    if (!hydrated) return;
    const updated = { ...hydrated.user, langOverride: next };
    saveUser(updated);
    setHydrated({ ...hydrated, lang: next, user: updated });
  };

  const setDraftPicks = (next: DraftPicks) => {
    if (!hydrated) return;
    setHydrated({ ...hydrated, draftPicks: next, isSaved: false });
  };

  const setDraftCaptainId = (next: string | null) => {
    if (!hydrated) return;
    setHydrated({ ...hydrated, draftCaptainId: next, isSaved: false });
  };

  const baselinePicks = useMemo(() => picksFromTeam(team), [team]);
  const isDirty =
    !arePicksEqual(draftPicks, baselinePicks) || draftCaptainId !== (team?.captainId ?? null);

  const compactPicks = useMemo(() => picksToCompact(draftPicks), [draftPicks]);
  const cost = useMemo(() => teamCost(compactPicks), [compactPicks]);
  const errors = useMemo(
    () => validateTeam(compactPicks, draftCaptainId, tournament.budget),
    [compactPicks, draftCaptainId, tournament.budget]
  );
  const isReady = errors.length === 0;

  const commitDraft = () => {
    if (!hydrated || !isReady) return;
    const next: Team = {
      id: team?.id ?? `team-${Date.now()}`,
      userId: hydrated.user.id,
      tournamentId: tournament.id,
      picks: compactPicks,
      captainId: draftCaptainId,
      totalCost: cost,
      createdAt: team?.createdAt ?? new Date().toISOString(),
      lockedAt: new Date().toISOString(),
      transfersUsed: team?.transfersUsed ?? 0,
    };
    saveTeam(next);
    setHydrated({
      ...hydrated,
      team: next,
      draftPicks: picksFromTeam(next),
      draftCaptainId: next.captainId,
      isSaved: true,
    });
    haptic("heavy");
  };

  const resetDraft = () => {
    if (!hydrated) return;
    setHydrated({
      ...hydrated,
      draftPicks: picksFromTeam(team),
      draftCaptainId: team?.captainId ?? null,
      isSaved: !!team,
    });
  };

  const requestTabChange = (next: Tab) => {
    if (next === activeTab) return;
    if (activeTab === "team" && isDirty) {
      setPendingTab(next);
      return;
    }
    setActiveTab(next);
  };

  const handleSaveAndLeave = () => {
    commitDraft();
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleDiscardAndLeave = () => {
    resetDraft();
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleStay = () => setPendingTab(null);

  const completeOnboarding = () => {
    if (!hydrated) return;
    if (typeof window !== "undefined") localStorage.setItem(ONBOARDING_KEY, "1");
    setHydrated({ ...hydrated, onboardingDone: true });
  };

  const leaderboard = useMemo(
    () => buildLeaderboard(team, tournament, user?.username ?? "@you"),
    [team, tournament, user?.username]
  );

  const userEntry = leaderboard.find((e) => e.isYou);
  const rank = userEntry?.rank ?? null;
  const totalPlayers = leaderboard.length;

  const onShare = () => {
    if (!team) return;
    const tg = getTelegram();
    const url = "https://t.me/whoissievers";
    const text = `${t.shareText} ${tournament.shortName}: ${rank ? `#${rank}` : "—"}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      );
    } else if (typeof window !== "undefined" && navigator.share) {
      navigator.share({ title: "Swim Skills Fantasy", text, url }).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
    }
  };

  // Telegram MainButton: only on the team tab, only when team is ready and dirty
  const mainButtonLabel = isSaved && !isDirty ? t.saved : t.saveAction;
  const mainButtonHandler =
    activeTab === "team" && isReady && isDirty ? commitDraft : null;
  useTelegramMainButton(mainButtonLabel, mainButtonHandler);

  if (!hydrated || !user) {
    return (
      <div className="app-shell">
        <Topbar username="@you" lang="ru" setLang={() => {}} />
      </div>
    );
  }

  if (!hydrated.onboardingDone) {
    return <Onboarding t={t} onDone={completeOnboarding} />;
  }

  return (
    <div className="app-shell">
      <Topbar
        username={user.username}
        lang={lang}
        setLang={setLang}
        rightSlot={
          <div className="budget-pill">
            {tournament.budget}
            <span className="label">{t.currency}</span>
          </div>
        }
      />

      {activeTab === "tournament" && (
        <TournamentScreen
          active={tournament}
          team={team}
          onGoToBuilder={() => requestTabChange("team")}
          t={t}
          rank={rank}
          totalPlayers={totalPlayers}
        />
      )}

      {activeTab === "team" && (
        <TeamBuilder
          tournament={tournament}
          picks={draftPicks}
          setPicks={setDraftPicks}
          captainId={draftCaptainId}
          setCaptainId={setDraftCaptainId}
          isDirty={isDirty}
          isSaved={isSaved}
          onSave={commitDraft}
          t={t}
          lang={lang}
          locked={false}
        />
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardScreen entries={leaderboard} tournament={tournament} t={t} />
      )}

      {activeTab === "profile" && (
        <ProfileScreen
          username={user.username}
          photoUrl={user.photoUrl}
          team={team}
          tournament={tournament}
          rank={rank}
          totalPlayers={totalPlayers}
          lang={lang}
          setLang={setLang}
          t={t}
          onShare={onShare}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={requestTabChange} t={t} />

      {pendingTab && (
        <BottomSheet
          title={t.unsavedTitle}
          text={t.unsavedText}
          actions={[
            {
              key: "save",
              label: t.saveAndLeave,
              variant: isReady ? "primary" : "default",
              onSelect: () => {
                if (isReady) handleSaveAndLeave();
                else handleStay();
              },
            },
            {
              key: "discard",
              label: t.discardAndLeave,
              variant: "danger",
              onSelect: handleDiscardAndLeave,
            },
          ]}
          onClose={handleStay}
          t={t}
        />
      )}

      {tournaments.length === 0 && <p className="muted">{t.noActive}</p>}
    </div>
  );
}
