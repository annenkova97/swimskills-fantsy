"use client";

import { useEffect, useState } from "react";

type Rarity = "Rare" | "Elite" | "GOAT";
type Tab = "home" | "collection" | "market" | "tournament";
type Lang = "en" | "ru";

type Card = {
id: string;
serial: string;
name: string;
image: string;
rarity: Rarity;
color: string;
};

type CollectionItem = Card & {
count: number;
};

type MarketCard = Card & {
price: number;
};

type Tournament = {
id: string;
title: string;
location: string;
dates: string;
status: "liveSoon" | "comingSoon";
prize: string;
color: string;
};

type TelegramWindow = Window & {
Telegram?: {
WebApp?: {
ready?: () => void;
expand?: () => void;
initDataUnsafe?: {
user?: {
language_code?: string;
};
};
};
};
};

const dictionary = {
en: {
username: "@whoissievers",
currency: "SS",
yourPack: "Your Pack",
openPack: "Open Pack",
swipeCards: "← swipe cards →",
swipeCollection: "← swipe collection →",
swipeMarket: "← swipe market →",
premiumVault: "PREMIUM VAULT",
myCollection: "My Collection",
cardsOwned: "Cards owned",
unique: "Unique",
market: "Market",
home: "Home",
collection: "Collection",
tournament: "Tournament",
buy: "Buy",
sell: "Sell",
upgrade: "Upgrade",
alreadyGoat: "Already GOAT",
needDuplicates: "Need 2 duplicates",
notEnough: "Not enough SS",
tournamentsTitle: "Fantasy Tournaments",
tournamentsText:
"Choose upcoming competitions, enter with your team and compete in Swim Skills Fantasy League.",
enterTeam: "Enter with team",
comingSoon: "Coming soon",
liveSoon: "Registration open",
prizePool: "Prize pool",
dates: "Dates",
location: "Location",
},
ru: {
username: "@whoissievers",
currency: "SS",
yourPack: "Твой пак",
openPack: "Открыть пак",
swipeCards: "← листай карточки →",
swipeCollection: "← листай коллекцию →",
swipeMarket: "← листай маркет →",
premiumVault: "ПРЕМИУМ ХРАНИЛИЩЕ",
myCollection: "Моя коллекция",
cardsOwned: "Карточек",
unique: "Уникальных",
market: "Маркет",
home: "Главная",
collection: "Коллекция",
tournament: "Турнир",
buy: "Купить",
sell: "Продать",
upgrade: "Улучшить",
alreadyGoat: "Карточка уже GOAT",
needDuplicates: "Нужно 2 дубликата",
notEnough: "Недостаточно SS",
tournamentsTitle: "Фентези-турниры",
tournamentsText:
"Выбирай ближайшие соревнования, заявляй свою команду и участвуй в Swim Skills Fantasy League.",
enterTeam: "Войти командой",
comingSoon: "Скоро",
liveSoon: "Регистрация открыта",
prizePool: "Призовой фонд",
dates: "Даты",
location: "Локация",
},
};

const marketCards: MarketCard[] = [
{
id: "summer",
serial: "AS-001",
name: "Summer McIntosh",
image: "/summer-card.png",
rarity: "GOAT",
color: "#f5c542",
price: 500,
},
{
id: "mckeown",
serial: "AS-002",
name: "Kaylee McKeown",
image: "/mckeown-card.png",
rarity: "GOAT",
color: "#3fbf6f",
price: 480,
},
{
id: "ledecky",
serial: "AS-003",
name: "Katie Ledecky",
image: "/ledecky-card.png",
rarity: "GOAT",
color: "#4da3ff",
price: 520,
},
{
id: "douglass",
serial: "AS-004",
name: "Kate Douglass",
image: "/douglass-card.png",
rarity: "Elite",
color: "#b06cff",
price: 350,
},
{
id: "evans",
serial: "AS-005",
name: "Angharad Evans",
image: "/evans-card.png",
rarity: "Rare",
color: "#ff7b54",
price: 220,
},
];

const tournaments: Tournament[] = [
{
id: "world-cup",
title: "World Cup Fantasy",
location: "World Aquatics",
dates: "October 2026",
status: "liveSoon",
prize: "10 000 SS",
color: "#ffcc00",
},
{
id: "ncaa",
title: "NCAA Championship",
location: "USA",
dates: "March 2026",
status: "comingSoon",
prize: "7 500 SS",
color: "#4da3ff",
},
{
id: "euro",
title: "European Aquatics",
location: "Europe",
dates: "Summer 2026",
status: "comingSoon",
prize: "5 000 SS",
color: "#3fbf6f",
},
];

function getSellPrice(rarity: Rarity) {
if (rarity === "Rare") return 100;
if (rarity === "Elite") return 300;
return 700;
}

function getUpgradeCost(rarity: Rarity) {
if (rarity === "Rare") return 150;
if (rarity === "Elite") return 350;
return 0;
}

function getNextRarity(rarity: Rarity): Rarity | null {
if (rarity === "Rare") return "Elite";
if (rarity === "Elite") return "GOAT";
return null;
}

function getTelegramLanguage(): Lang {
if (typeof window === "undefined") return "en";

const tgWindow = window as TelegramWindow;

const code =
tgWindow.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || "en";

if (code.startsWith("ru")) return "ru";
return "en";
}

export default function Home() {
const [lang, setLang] = useState<Lang>("en");
const [balance, setBalance] = useState(1675);
const [collection, setCollection] = useState<CollectionItem[]>([]);
const [activeTab, setActiveTab] = useState<Tab>("home");
const [selectedCard, setSelectedCard] = useState<Card | null>(null);

const t = dictionary[lang];

useEffect(() => {
const tgWindow = window as TelegramWindow;

tgWindow.Telegram?.WebApp?.ready?.();
tgWindow.Telegram?.WebApp?.expand?.();

setLang(getTelegramLanguage());

const savedCollection = localStorage.getItem("collection");
const savedBalance = localStorage.getItem("balance");

if (savedCollection) setCollection(JSON.parse(savedCollection));
if (savedBalance) setBalance(Number(savedBalance));
}, []);

useEffect(() => {
localStorage.setItem("collection", JSON.stringify(collection));
localStorage.setItem("balance", balance.toString());
}, [collection, balance]);

const addCardToCollection = (card: Card) => {
setCollection((prev) => {
const existing = prev.find((c) => c.id === card.id);

if (existing) {
return prev.map((c) =>
c.id === card.id ? { ...c, count: c.count + 1 } : c
);
}

return [...prev, { ...card, count: 1 }];
});
};

const openStarterPack = () => {
const randomCard =
marketCards[Math.floor(Math.random() * marketCards.length)];

addCardToCollection(randomCard);
};

const sellCard = (card: CollectionItem) => {
const sellPrice = getSellPrice(card.rarity);

setBalance((prev) => prev + sellPrice);

setCollection((prev) =>
prev
.map((c) => (c.id === card.id ? { ...c, count: c.count - 1 } : c))
.filter((c) => c.count > 0)
);
};

const upgradeCard = (card: CollectionItem) => {
const nextRarity = getNextRarity(card.rarity);
const cost = getUpgradeCost(card.rarity);

if (!nextRarity) {
alert(t.alreadyGoat);
return;
}

if (card.count < 2) {
alert(t.needDuplicates);
return;
}

if (balance < cost) {
alert(t.notEnough);
return;
}

const rewardPool = marketCards.filter((c) => c.rarity === nextRarity);
const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];

setBalance((prev) => prev - cost);

setCollection((prev) =>
prev
.map((c) => (c.id === card.id ? { ...c, count: c.count - 2 } : c))
.filter((c) => c.count > 0)
);

addCardToCollection(reward);
};

const totalCards = collection.reduce((sum, c) => sum + c.count, 0);

return (
<div className="app">
<style>{`
* { box-sizing: border-box; }
body { margin: 0; background: #000; }

.app {
min-height: 100vh;
min-height: 100dvh;
background:
radial-gradient(circle at top, rgba(255,204,0,0.13), transparent 30%),
#000;
color: white;
padding: 18px 14px 112px;
overflow-x: hidden;
font-family: Arial, Helvetica, sans-serif;
}

.topbar {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 18px;
gap: 14px;
}

.brand-title {
color: #ffcc00;
font-size: 34px;
font-weight: 900;
margin: 0;
line-height: 0.95;
}

.username {
color: #999;
margin-top: 6px;
font-size: 15px;
}

.balance {
border: 2px solid #ffcc00;
border-radius: 24px;
padding: 9px 18px;
color: #ffcc00;
font-weight: 900;
font-size: 22px;
text-align: center;
min-width: 100px;
box-shadow: 0 0 18px rgba(255,204,0,0.15);
}

.screen { width: 100%; }

.pack-header {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
margin-top: 18px;
margin-bottom: 14px;
}

.section-title {
color: #ffcc00;
font-size: 24px;
font-weight: 900;
margin: 0;
}

.pack-button {
border: 1.5px solid rgba(255,204,0,0.85);
border-radius: 16px;
padding: 10px 16px;
background: linear-gradient(135deg, #ffcc00, #ffe680);
color: #000;
font-weight: 900;
font-size: 15px;
box-shadow: 0 0 16px rgba(255,204,0,0.2);
white-space: nowrap;
}

.scroll-row {
display: flex;
gap: 14px;
overflow-x: auto;
padding-bottom: 14px;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
}

.scroll-row::-webkit-scrollbar { display: none; }

.card {
min-width: 220px;
max-width: 220px;
background: #0c0c0c;
border-radius: 22px;
overflow: hidden;
scroll-snap-align: start;
cursor: pointer;
box-shadow: 0 10px 24px rgba(0,0,0,0.45);
}

.card-img {
width: 100%;
display: block;
}

.card-body { padding: 12px; }

.card-name {
margin: 0;
font-size: 16px;
font-weight: 800;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.card-meta {
color: #999;
margin-top: 6px;
font-size: 14px;
}

.actions {
display: flex;
flex-direction: column;
gap: 8px;
margin-top: 12px;
}

.btn {
width: 100%;
padding: 10px;
border-radius: 12px;
font-weight: 900;
border: none;
font-size: 13px;
}

.btn-gold {
background: linear-gradient(135deg, #ffcc00, #ffe680);
color: #000;
}

.btn-dark {
background: transparent;
color: #ffcc00;
border: 1px solid #ffcc00;
}

.swipe-hint {
text-align: center;
color: rgba(255,204,0,0.55);
font-size: 12px;
font-weight: 800;
letter-spacing: 1px;
margin-top: -2px;
margin-bottom: 12px;
}

.vault, .tournament-intro {
border: 1px solid rgba(255,204,0,0.3);
border-radius: 24px;
padding: 18px;
background:
linear-gradient(180deg, rgba(255,204,0,0.1), rgba(0,0,0,0.85)),
#080808;
margin-bottom: 18px;
box-shadow: 0 0 30px rgba(255,204,0,0.12);
}

.vault-kicker {
color: #ffcc00;
font-size: 11px;
letter-spacing: 3px;
font-weight: 900;
margin: 0;
}

.vault-title {
margin: 8px 0;
font-size: 28px;
font-weight: 900;
}

.vault-subtitle {
color: #999;
margin: 0;
}

.tournament-list {
display: flex;
flex-direction: column;
gap: 16px;
padding-bottom: 20px;
}

.tournament-card {
border-radius: 26px;
padding: 18px;
background:
radial-gradient(circle at top right, rgba(255,204,0,0.15), transparent 32%),
#080808;
border: 1.5px solid rgba(255,204,0,0.28);
box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}

.tournament-status {
display: inline-block;
padding: 6px 10px;
border-radius: 999px;
background: rgba(255,204,0,0.12);
color: #ffcc00;
font-size: 12px;
font-weight: 900;
margin-bottom: 12px;
}

.tournament-title {
font-size: 24px;
font-weight: 900;
margin: 0 0 12px;
}

.tournament-info {
color: #aaa;
font-size: 14px;
line-height: 1.55;
margin-bottom: 16px;
}

.modal {
position: fixed;
inset: 0;
background: rgba(0,0,0,0.92);
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
padding: 18px;
}

.modal-img {
width: min(92vw, 420px);
max-height: 86dvh;
object-fit: contain;
border-radius: 24px;
}

.bottom-nav {
position: fixed;
left: 12px;
right: 12px;
bottom: 14px;
z-index: 100;
background: linear-gradient(180deg, #111, #070707);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 30px;
padding: 12px 8px;
display: flex;
justify-content: space-around;
align-items: center;
box-shadow: 0 0 32px rgba(0,0,0,0.75);
backdrop-filter: blur(12px);
}

.nav-btn {
width: 25%;
background: none;
border: none;
color: #666;
display: flex;
flex-direction: column;
align-items: center;
gap: 5px;
font-size: 11px;
font-weight: 900;
}

.nav-icon {
font-size: 22px;
line-height: 1;
}

.nav-btn.active { color: #ffcc00; }
`}</style>

<div className="topbar">
<div>
<h1 className="brand-title">Swim Skills</h1>
<div className="username">{t.username}</div>
</div>

<div className="balance">
{balance}
<br />
{t.currency}
</div>
</div>

{activeTab === "home" && (
<div className="screen">
<div className="pack-header">
<h2 className="section-title">{t.yourPack}</h2>

<button className="pack-button" onClick={openStarterPack}>
{t.openPack}
</button>
</div>

<CardRow
cards={collection}
setSelectedCard={setSelectedCard}
sellCard={sellCard}
upgradeCard={upgradeCard}
t={t}
/>

<div className="swipe-hint">{t.swipeCards}</div>
</div>
)}

{activeTab === "collection" && (
<div className="screen">
<div className="vault">
<p className="vault-kicker">{t.premiumVault}</p>

<h2 className="vault-title">{t.myCollection}</h2>

<p className="vault-subtitle">
{t.cardsOwned}: {totalCards} · {t.unique}: {collection.length}
</p>
</div>

<CardRow
cards={collection}
setSelectedCard={setSelectedCard}
sellCard={sellCard}
upgradeCard={upgradeCard}
t={t}
/>

<div className="swipe-hint">{t.swipeCollection}</div>
</div>
)}

{activeTab === "market" && (
<div className="screen">
<div className="pack-header">
<h2 className="section-title">{t.market}</h2>
</div>

<div className="scroll-row">
{marketCards.map((card) => (
<div
key={card.id}
className="card"
style={{ border: `2px solid ${card.color}` }}
onClick={() => setSelectedCard(card)}
>
<img className="card-img" src={card.image} alt={card.name} />

<div className="card-body">
<h3 className="card-name">{card.name}</h3>
<div className="card-meta">{card.rarity}</div>

<button
className="btn btn-gold"
style={{ marginTop: 12 }}
onClick={(e) => {
e.stopPropagation();

if (balance < card.price) {
alert(t.notEnough);
return;
}

setBalance((prev) => prev - card.price);
addCardToCollection(card);
}}
>
{t.buy} · {card.price} {t.currency}
</button>
</div>
</div>
))}
</div>

<div className="swipe-hint">{t.swipeMarket}</div>
</div>
)}

{activeTab === "tournament" && (
<div className="screen">
<div className="tournament-intro">
<p className="vault-kicker">FANTASY LEAGUE</p>

<h2 className="vault-title">{t.tournamentsTitle}</h2>

<p className="vault-subtitle">{t.tournamentsText}</p>
</div>

<div className="tournament-list">
{tournaments.map((tour) => (
<div
key={tour.id}
className="tournament-card"
style={{
borderColor: tour.color,
boxShadow: `0 0 26px ${tour.color}22`,
}}
>
<div className="tournament-status">
{tour.status === "liveSoon" ? t.liveSoon : t.comingSoon}
</div>

<h3 className="tournament-title">{tour.title}</h3>

<div className="tournament-info">
📍 {t.location}: {tour.location}
<br />
🗓 {t.dates}: {tour.dates}
<br />
🏆 {t.prizePool}: {tour.prize}
</div>

<button
className="btn btn-gold"
onClick={() => alert(t.enterTeam)}
>
{t.enterTeam}
</button>
</div>
))}
</div>
</div>
)}

{selectedCard && (
<div className="modal" onClick={() => setSelectedCard(null)}>
<img
className="modal-img"
src={selectedCard.image}
alt={selectedCard.name}
style={{
border: `3px solid ${selectedCard.color}`,
boxShadow: `0 0 40px ${selectedCard.color}`,
}}
/>
</div>
)}

<div className="bottom-nav">
<NavButton
tab="home"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="⌂"
label={t.home}
/>

<NavButton
tab="collection"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="▥"
label={t.collection}
/>

<NavButton
tab="market"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="🛒"
label={t.market}
/>

<NavButton
tab="tournament"
activeTab={activeTab}
setActiveTab={setActiveTab}
icon="🏆"
label={t.tournament}
/>
</div>
</div>
);
}

function CardRow({
cards,
setSelectedCard,
sellCard,
upgradeCard,
t,
}: {
cards: CollectionItem[];
setSelectedCard: (card: Card) => void;
sellCard: (card: CollectionItem) => void;
upgradeCard: (card: CollectionItem) => void;
t: typeof dictionary.en;
}) {
return (
<div className="scroll-row">
{cards.map((card) => (
<div
key={card.id}
className="card"
style={{ border: `2px solid ${card.color}` }}
onClick={() => setSelectedCard(card)}
>
<img className="card-img" src={card.image} alt={card.name} />

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">
{card.rarity} · x{card.count}
</div>

<div className="actions">
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
>
{t.upgrade}
</button>

<button
className="btn btn-dark"
onClick={(e) => {
e.stopPropagation();
sellCard(card);
}}
>
{t.sell} · {getSellPrice(card.rarity)} {t.currency}
</button>
</div>
</div>
</div>
))}
</div>
);
}

function NavButton({
tab,
activeTab,
setActiveTab,
icon,
label,
}: {
tab: Tab;
activeTab: Tab;
setActiveTab: (tab: Tab) => void;
icon: string;
label: string;
}) {
const isActive = activeTab === tab;

return (
<button
className={`nav-btn ${isActive ? "active" : ""}`}
onClick={() => setActiveTab(tab)}
>
<span className="nav-icon">{icon}</span>
<span>{label}</span>
</button>
);
}

