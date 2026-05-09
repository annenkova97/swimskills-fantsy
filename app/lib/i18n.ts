export type Lang = "en" | "ru";

type DictShape = {
  appName: string;
  currency: string;
  yourTeam: string;
  tournament: string;
  leaderboard: string;
  catalog: string;
  profile: string;
  teamBuilder: string;
  pickASwimmer: string;
  budget: string;
  remaining: string;
  captain: string;
  captainHint: string;
  setCaptain: string;
  captainSet: string;
  submit: string;
  saveAction: string;
  saved: string;
  teamLocked: string;
  edit: string;
  save: string;
  transfer: string;
  transferUsed: string;
  selected: string;
  notSelected: string;
  rules: string;
  rulesText: string;
  slotSprint: string;
  slotDistance: string;
  slotUniversal: string;
  slotWildcard: string;
  archetypeSprint: string;
  archetypeDistance: string;
  archetypeUniversal: string;
  archetypeOther: string;
  deadline: string;
  daysLeft: string;
  hoursLeft: string;
  countdownLocked: string;
  activeTournament: string;
  upcomingTournaments: string;
  enterTournament: string;
  viewTournament: string;
  open: string;
  upcoming: string;
  locked: string;
  live: string;
  finished: string;
  yourPosition: string;
  points: string;
  rank: string;
  team: string;
  score: string;
  you: string;
  total: string;
  pickGuide: string;
  filterAll: string;
  filterSprint: string;
  filterDistance: string;
  filterUniversal: string;
  filterWomen: string;
  filterMen: string;
  selectSlot: string;
  chooseSwimmer: string;
  addToSlot: string;
  remove: string;
  cancel: string;
  confirm: string;
  teamComplete: string;
  teamHasIssues: string;
  errBudget: string;
  errWomen: string;
  errMen: string;
  errCountry: string;
  errSprint: string;
  errDistance: string;
  errUniversal: string;
  errCaptain: string;
  errCount: string;
  welcome: string;
  welcomeText: string;
  start: string;
  share: string;
  shareText: string;
  notLogged: string;
  swimmer: string;
  country: string;
  archetype: string;
  events: string;
  ovr: string;
  price: string;
  yourScore: string;
  finalRank: string;
  transfersLeft: string;
  confirmLock: string;
  confirmLockHint: string;
  noActive: string;
  backHome: string;
  teamPreview: string;
  captainBadge: string;
  male: string;
  female: string;
  // new
  pickThisCard: string;
  current: string;
  swipeHint: string;
  slotActionTitle: string;
  slotActionReplace: string;
  slotActionRemove: string;
  unsavedTitle: string;
  unsavedText: string;
  saveAndLeave: string;
  discardAndLeave: string;
  stayHere: string;
  captainModeTitle: string;
  captainModeText: string;
  captainModeChange: string;
  pickCaptainHint: string;
  // onboarding
  onb1Title: string;
  onb1Text: string;
  onb2Title: string;
  onb2Text: string;
  onb3Title: string;
  onb3Text: string;
  onbStart: string;
  onbSkip: string;
};

export const dictionary: Record<Lang, DictShape> = {
  en: {
    appName: "Swim Skills Fantasy",
    currency: "SS",
    yourTeam: "Team",
    tournament: "Tournament",
    leaderboard: "Leaderboard",
    catalog: "Catalog",
    profile: "Profile",
    teamBuilder: "Team Builder",
    pickASwimmer: "Pick a swimmer",
    budget: "Budget",
    remaining: "Remaining",
    captain: "Captain",
    captainHint: "×2 points",
    setCaptain: "Set captain",
    captainSet: "Captain ✓",
    submit: "Save team",
    saveAction: "Save",
    saved: "Saved ✓",
    teamLocked: "Team locked",
    edit: "Edit",
    save: "Save",
    transfer: "Transfer",
    transferUsed: "Transfer used",
    selected: "Selected",
    notSelected: "Empty",
    rules: "Rules",
    rulesText:
      "7 swimmers · 1000 SS budget · ≥2 women · ≥2 men · ≤3 from one country · 1 captain ×2",
    slotSprint: "Sprint",
    slotDistance: "Distance",
    slotUniversal: "Universal",
    slotWildcard: "Wildcard",
    archetypeSprint: "Sprint (≤100m)",
    archetypeDistance: "Distance (≥400m)",
    archetypeUniversal: "Universal (3+ events)",
    archetypeOther: "Specialist",
    deadline: "Deadline",
    daysLeft: "days left",
    hoursLeft: "h left",
    countdownLocked: "Team locked",
    activeTournament: "Active tournament",
    upcomingTournaments: "Upcoming tournaments",
    enterTournament: "Build team",
    viewTournament: "View",
    open: "Registration open",
    upcoming: "Upcoming",
    locked: "Locked",
    live: "Live",
    finished: "Finished",
    yourPosition: "Your rank",
    points: "pts",
    rank: "Rank",
    team: "Team",
    score: "Score",
    you: "You",
    total: "Total",
    pickGuide: "Swipe cards · tap to pick",
    filterAll: "All",
    filterSprint: "Sprint",
    filterDistance: "Distance",
    filterUniversal: "Universal",
    filterWomen: "Women",
    filterMen: "Men",
    selectSlot: "Select slot",
    chooseSwimmer: "Choose swimmer",
    addToSlot: "Add",
    remove: "Remove",
    cancel: "Cancel",
    confirm: "Confirm",
    teamComplete: "Team is valid ✓",
    teamHasIssues: "Fix to continue:",
    errBudget: "Over budget",
    errWomen: "At least 2 women required",
    errMen: "At least 2 men required",
    errCountry: "Max 3 swimmers from one country",
    errSprint: "SPRINT slot needs sprint specialist",
    errDistance: "DISTANCE slot needs distance specialist",
    errUniversal: "UNIVERSAL slot needs versatile swimmer",
    errCaptain: "Pick a captain",
    errCount: "Need exactly 7 swimmers",
    welcome: "Welcome to Swim Skills Fantasy",
    welcomeText:
      "Build a 7-swimmer team within 1000 SS, pick your captain, and climb the leaderboard with real World Aquatics results.",
    start: "Start",
    share: "Share team",
    shareText: "I just built my team for",
    notLogged: "Not signed in",
    swimmer: "Swimmer",
    country: "Country",
    archetype: "Archetype",
    events: "Events",
    ovr: "OVR",
    price: "Price",
    yourScore: "Your score",
    finalRank: "Final rank",
    transfersLeft: "transfers left",
    confirmLock: "Lock team for this tournament?",
    confirmLockHint: "After locking you have 1 free transfer.",
    noActive: "No active tournaments yet",
    backHome: "Home",
    teamPreview: "Team preview",
    captainBadge: "C",
    male: "M",
    female: "W",
    pickThisCard: "Tap card to pick",
    current: "Current pick",
    swipeHint: "← swipe cards →",
    slotActionTitle: "Slot action",
    slotActionReplace: "Replace swimmer",
    slotActionRemove: "Remove from team",
    unsavedTitle: "Unsaved changes",
    unsavedText: "You have unsaved changes to your team.",
    saveAndLeave: "Save",
    discardAndLeave: "Discard",
    stayHere: "Stay",
    captainModeTitle: "Pick your captain",
    captainModeText: "Their points double (×2). Tap any swimmer.",
    captainModeChange: "Change captain",
    pickCaptainHint: "Tap a swimmer to make captain",
    onb1Title: "Build your team",
    onb1Text: "Pick 7 swimmers within a 1000 SS budget. Mix sprinters, distance and universal.",
    onb2Title: "Pick a captain",
    onb2Text: "Your captain scores ×2 fantasy points. Choose wisely.",
    onb3Title: "Real-world scoring",
    onb3Text: "Your team scores from real World Aquatics meets. Climb the leaderboard.",
    onbStart: "Start playing",
    onbSkip: "Skip",
  },
  ru: {
    appName: "Swim Skills Fantasy",
    currency: "SS",
    yourTeam: "Команда",
    tournament: "Турнир",
    leaderboard: "Таблица",
    catalog: "Каталог",
    profile: "Профиль",
    teamBuilder: "Сборка команды",
    pickASwimmer: "Выбрать пловца",
    budget: "Бюджет",
    remaining: "Осталось",
    captain: "Капитан",
    captainHint: "×2 очки",
    setCaptain: "Назначить",
    captainSet: "Капитан ✓",
    submit: "Сохранить команду",
    saveAction: "Сохранить",
    saved: "Сохранено ✓",
    teamLocked: "Команда закреплена",
    edit: "Изменить",
    save: "Сохранить",
    transfer: "Трансфер",
    transferUsed: "Трансфер использован",
    selected: "Выбрано",
    notSelected: "Пусто",
    rules: "Правила",
    rulesText:
      "7 пловцов · бюджет 1000 SS · ≥2 женщины · ≥2 мужчины · ≤3 из одной страны · 1 капитан ×2",
    slotSprint: "Спринт",
    slotDistance: "Стайер",
    slotUniversal: "Универсал",
    slotWildcard: "Свободный",
    archetypeSprint: "Спринт (≤100м)",
    archetypeDistance: "Стайер (≥400м)",
    archetypeUniversal: "Универсал (3+ дисциплины)",
    archetypeOther: "Специалист",
    deadline: "Дедлайн",
    daysLeft: "дн.",
    hoursLeft: "ч",
    countdownLocked: "Команда закреплена",
    activeTournament: "Активный турнир",
    upcomingTournaments: "Будущие турниры",
    enterTournament: "Собрать команду",
    viewTournament: "Открыть",
    open: "Регистрация открыта",
    upcoming: "Скоро",
    locked: "Закрыто",
    live: "Идёт",
    finished: "Завершён",
    yourPosition: "Твоё место",
    points: "очк",
    rank: "Место",
    team: "Команда",
    score: "Очки",
    you: "Ты",
    total: "Итого",
    pickGuide: "Свайпай карточки · тапни чтобы выбрать",
    filterAll: "Все",
    filterSprint: "Спринт",
    filterDistance: "Стайер",
    filterUniversal: "Универсал",
    filterWomen: "Ж",
    filterMen: "М",
    selectSlot: "Выбери слот",
    chooseSwimmer: "Выбери пловца",
    addToSlot: "Добавить",
    remove: "Убрать",
    cancel: "Отмена",
    confirm: "Подтвердить",
    teamComplete: "Команда готова ✓",
    teamHasIssues: "Исправь, чтобы продолжить:",
    errBudget: "Превышен бюджет",
    errWomen: "Минимум 2 женщины",
    errMen: "Минимум 2 мужчины",
    errCountry: "Не более 3 из одной страны",
    errSprint: "В слот SPRINT — только спринтер",
    errDistance: "В слот DISTANCE — только стайер",
    errUniversal: "В слот UNIVERSAL — только универсал",
    errCaptain: "Назначь капитана",
    errCount: "Нужно ровно 7 пловцов",
    welcome: "Swim Skills Fantasy",
    welcomeText:
      "Собери команду из 7 пловцов в бюджет 1000 SS, назначь капитана и поднимайся в таблице по реальным результатам с турниров World Aquatics.",
    start: "Начать",
    share: "Поделиться",
    shareText: "Собрал команду на",
    notLogged: "Не авторизован",
    swimmer: "Пловец",
    country: "Страна",
    archetype: "Архетип",
    events: "Дистанции",
    ovr: "OVR",
    price: "Цена",
    yourScore: "Очки",
    finalRank: "Итоговое место",
    transfersLeft: "трансферов",
    confirmLock: "Закрепить команду на этот турнир?",
    confirmLockHint: "После закрепления у тебя 1 бесплатный трансфер.",
    noActive: "Нет активных турниров",
    backHome: "На главную",
    teamPreview: "Команда",
    captainBadge: "C",
    male: "М",
    female: "Ж",
    pickThisCard: "Тапни карточку чтобы выбрать",
    current: "Текущий выбор",
    swipeHint: "← свайпай карточки →",
    slotActionTitle: "Что делаем со слотом?",
    slotActionReplace: "Заменить пловца",
    slotActionRemove: "Убрать из команды",
    unsavedTitle: "Несохранённые изменения",
    unsavedText: "Изменения в команде ещё не сохранены.",
    saveAndLeave: "Сохранить",
    discardAndLeave: "Сбросить",
    stayHere: "Остаться",
    captainModeTitle: "Выбери капитана",
    captainModeText: "Его очки удваиваются (×2). Тапни любого пловца.",
    captainModeChange: "Сменить капитана",
    pickCaptainHint: "Тапни пловца, чтобы сделать капитаном",
    onb1Title: "Собери команду",
    onb1Text: "Выбери 7 пловцов в бюджет 1000 SS. Микс спринтеров, стайеров и универсалов.",
    onb2Title: "Назначь капитана",
    onb2Text: "Очки капитана удваиваются (×2). Выбирай с умом.",
    onb3Title: "Реальный скоринг",
    onb3Text: "Очки начисляются по реальным результатам World Aquatics. Поднимайся в таблице.",
    onbStart: "Начать игру",
    onbSkip: "Пропустить",
  },
};

export type Dict = DictShape;

export function detectLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const tg = (window as unknown as {
    Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } };
  }).Telegram;
  const code = tg?.WebApp?.initDataUnsafe?.user?.language_code ?? navigator.language ?? "ru";
  return code.toLowerCase().startsWith("en") ? "en" : "ru";
}
