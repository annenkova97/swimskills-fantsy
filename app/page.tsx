"use client";

import { useEffect, useState } from "react";

type Rarity = "Rare" | "Elite" | "GOAT";

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
{
id: "leon",
serial: "AS-006",
name: "Leon Marchand",
image: "/leon-card.png",
rarity: "GOAT",
color: "#4fd1c5",
price: 550,
},
{
id: "steenbergen",
serial: "AS-007",
name: "Marrit Steenbergen",
image: "/steenbergen-card.png",
rarity: "Elite",
color: "#ff66c4",
price: 300,
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

export default function Home() {
const [balance, setBalance] = useState(1675);
const [collection, setCollection] = useState<CollectionItem[]>([]);
const [activeTab, setActiveTab] = useState("home");
const [selectedCard, setSelectedCard] = useState<Card | null>(null);

useEffect(() => {
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
alert("This card is already GOAT");
return;
}

if (card.count < 2) {
alert("You need 2 duplicate cards");
return;
}

if (balance < cost) {
alert("Not enough SS");
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
* {
box-sizing: border-box;
}

body {
margin: 0;
background: #000;
}

.app {
min-height: 100vh;
min-height: 100dvh;
background:
radial-gradient(circle at top, rgba(255, 204, 0, 0.16), transparent 28%),
linear-gradient(180deg, #050505 0%, #000 100%);
color: white;
padding: calc(env(safe-area-inset-top) + 12px) 14px calc(env(safe-area-inset-bottom) + 92px);
overflow-x: hidden;
font-family: Arial, Helvetica, sans-serif;
}

.topbar {
display: flex;
justify-content: space-between;
align-items: center;
gap: 12px;
margin-bottom: 18px;
}

.brand-title {
color: #ffcc00;
margin: 0;
font-size: clamp(28px, 8vw, 38px);
font-weight: 900;
line-height: 0.95;
}

.username {
color: #9ca3af;
margin: 6px 0 0;
font-size: 15px;
}

.balance {
border: 2px solid #ffcc00;
border-radius: 24px;
padding: 8px 18px;
color: #ffcc00;
font-weight: 900;
font-size: clamp(18px, 5vw, 24px);
text-align: center;
min-width: 96px;
box-shadow: 0 0 22px rgba(255, 204, 0, 0.18);
}

.pack-button {
width: 100%;
border: none;
border-radius: 26px;
padding: 20px 22px;
color: #000;
background: linear-gradient(135deg, #ffcc00, #ffdf55);
font-size: clamp(24px, 7vw, 32px);
font-weight: 900;
box-shadow: 0 0 30px rgba(255, 204, 0, 0.25);
}

.section-title {
color: #ffcc00;
font-size: 24px;
font-weight: 900;
margin: 28px 0 14px;
letter-spacing: 0.5px;
}

.scroll-row {
display: flex;
gap: 14px;
overflow-x: auto;
padding: 4px 2px 18px;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
}

.scroll-row::-webkit-scrollbar {
display: none;
}

.card {
min-width: min(62vw, 245px);
max-width: min(62vw, 245px);
background: #101010;
border-radius: 22px;
overflow: hidden;
scroll-snap-align: start;
cursor: pointer;
box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
}

.card-img {
width: 100%;
display: block;
}

.card-body {
padding: 12px;
}

.card-name {
margin: 0;
font-size: 17px;
font-weight: 800;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.card-meta {
color: #aaa;
margin: 7px 0 0;
font-size: 14px;
}

.actions {
display: grid;
grid-template-columns: 1fr;
gap: 8px;
margin-top: 10px;
}

.btn {
width: 100%;
padding: 10px;
border-radius: 13px;
font-weight: 900;
font-size: 13px;
border: none;
}

.btn-gold {
background: linear-gradient(135deg, #ffcc00, #ffef8a);
color: #000;
}

.btn-dark {
background: transparent;
color: #ffcc00;
border: 1px solid #ffcc00;
}

.vault {
border: 1px solid rgba(255, 204, 0, 0.35);
border-radius: 26px;
padding: 18px;
background:
linear-gradient(180deg, rgba(255, 204, 0, 0.12), rgba(0,0,0,0.72)),
#090909;
box-shadow: 0 0 38px rgba(255, 204, 0, 0.12);
margin-bottom: 18px;
}

.vault-kicker {
color: #ffcc00;
font-size: 12px;
font-weight: 900;
letter-spacing: 3px;
margin: 0;
}

.vault-title {
margin: 7px 0;
font-size: 30px;
font-weight: 900;
}

.vault-subtitle {
color: #999;
margin: 0;
font-size: 15px;
}

.modal {
position: fixed;
inset: 0;
z-index: 999;
background: rgba(0,0,0,0.92);
display: flex;
align-items: center;
justify-content: center;
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
left: 0;
right: 0;
bottom: 0;
z-index: 100;
background: rgba(0,0,0,0.96);
border-top: 1px solid rgba(255,255,255,0.08);
padding: 13px 10px calc(env(safe-area-inset-bottom) + 13px);
display: flex;
justify-content: space-around;
backdrop-filter: blur(12px);
}

.nav-btn {
background: none;
border: none;
color: #777;
font-size: clamp(17px, 5vw, 22px);
font-weight: 900;
text-transform: uppercase;
}

.nav-btn.active {
color: #ffcc00;
}
`}</style>

<div className="topbar">
<div>
<h1 className="brand-title">Swim Skills</h1>
<p className="username">@whoissievers</p>
</div>

<div className="balance">
{balance}
<br />
SS
</div>
</div>

{activeTab === "home" && (
<>
<button className="pack-button" onClick={openStarterPack}>
Open Starter Pack
</button>

<h2 className="section-title">Your Pack</h2>

<CardRow cards={collection} setSelectedCard={setSelectedCard} />
</>
)}

{activeTab === "collection" && (
<>
<div className="vault">
<p className="vault-kicker">PREMIUM VAULT</p>
<h2 className="vault-title">My Collection</h2>
<p className="vault-subtitle">
Cards owned: {totalCards} · Unique: {collection.length}
</p>
</div>

<div className="scroll-row">
{collection.map((card) => (
<div
key={card.id}
className="card"
style={{
border: `2px solid ${card.color}`,
boxShadow: `0 0 24px ${card.color}55`,
}}
onClick={() => setSelectedCard(card)}
>
<img className="card-img" src={card.image} alt={card.name} />

<div className="card-body">
<h3 className="card-name">{card.name}</h3>
<p className="card-meta">
{card.rarity} · x{card.count}
</p>

<div className="actions">
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
>
UPGRADE
</button>

<button
className="btn btn-dark"
onClick={(e) => {
e.stopPropagation();
sellCard(card);
}}
>
SELL — {getSellPrice(card.rarity)} SS
</button>
</div>
</div>
</div>
))}
</div>
</>
)}

{activeTab === "market" && (
<>
<h2 className="section-title">Market</h2>

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
<p className="card-meta">{card.rarity}</p>

<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();

if (balance < card.price) {
alert("Not enough SS");
return;
}

setBalance((prev) => prev - card.price);
addCardToCollection(card);
}}
>
BUY — {card.price} SS
</button>
</div>
</div>
))}
</div>
</>
)}

{selectedCard && (
<div className="modal" onClick={() => setSelectedCard(null)}>
<img
className="modal-img"
src={selectedCard.image}
alt={selectedCard.name}
style={{
border: `3px solid ${selectedCard.color}`,
boxShadow: `0 0 42px ${selectedCard.color}`,
}}
/>
</div>
)}

<div className="bottom-nav">
{["home", "collection", "market"].map((tab) => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`nav-btn ${activeTab === tab ? "active" : ""}`}
>
{tab}
</button>
))}
</div>
</div>
);
}

function CardRow({
cards,
setSelectedCard,
}: {
cards: CollectionItem[];
setSelectedCard: (card: Card) => void;
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
<p className="card-meta">x{card.count}</p>
</div>
</div>
))}
</div>
);
}

