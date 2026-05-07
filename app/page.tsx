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
alert("Already GOAT");
return;
}

if (card.count < 2) {
alert("Need 2 duplicates");
return;
}

if (balance < cost) {
alert("Not enough SS");
return;
}

const rewardPool = marketCards.filter((c) => c.rarity === nextRarity);
const reward =
rewardPool[Math.floor(Math.random() * rewardPool.length)];

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
background:
radial-gradient(circle at top, rgba(255,204,0,0.12), transparent 30%),
#000;
color: white;
padding: 20px 14px 110px;
overflow-x: hidden;
font-family: Arial, sans-serif;
}

.topbar {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 18px;
}

.brand-title {
color: #ffcc00;
font-size: 38px;
font-weight: 900;
margin: 0;
line-height: 0.9;
}

.username {
color: #999;
margin-top: 4px;
font-size: 15px;
}

.balance {
border: 2px solid #ffcc00;
border-radius: 24px;
padding: 10px 18px;
color: #ffcc00;
font-weight: 900;
font-size: 24px;
text-align: center;
min-width: 100px;
}

.pack-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-top: 18px;
margin-bottom: 14px;
}

.section-title {
color: #ffcc00;
font-size: 22px;
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
}

.scroll-row {
display: flex;
gap: 14px;
overflow-x: auto;
padding-bottom: 14px;
scroll-snap-type: x mandatory;
}

.scroll-row::-webkit-scrollbar {
display: none;
}

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

.card-body {
padding: 12px;
}

.card-name {
margin: 0;
font-size: 16px;
font-weight: 800;
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
margin-top: -4px;
margin-bottom: 10px;
}

.vault {
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

.bottom-nav {
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: rgba(0,0,0,0.95);
border-top: 1px solid rgba(255,255,255,0.08);
padding: 14px 10px 30px;
display: flex;
justify-content: space-around;
backdrop-filter: blur(10px);
}

.nav-btn {
background: none;
border: none;
color: #777;
font-size: 20px;
font-weight: 900;
text-transform: uppercase;
}

.nav-btn.active {
color: #ffcc00;
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
border-radius: 24px;
}
`}</style>

<div className="topbar">
<div>
<h1 className="brand-title">Swim Skills</h1>
<div className="username">@whoissievers</div>
</div>

<div className="balance">
{balance}
<br />
SS
</div>
</div>

{activeTab === "home" && (
<>
<div className="pack-header">
<h2 className="section-title">Your Pack</h2>

<button className="pack-button" onClick={openStarterPack}>
Open Pack
</button>
</div>

<div className="scroll-row">
{collection.map((card) => (
<div
key={card.id}
className="card"
style={{
border: `2px solid ${card.color}`,
}}
onClick={() => setSelectedCard(card)}
>
<img
className="card-img"
src={card.image}
alt={card.name}
/>

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">x{card.count}</div>

<div className="actions">
<button
className="btn btn-gold"
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
>
Upgrade
</button>

<button
className="btn btn-dark"
onClick={(e) => {
e.stopPropagation();
sellCard(card);
}}
>
Sell · {getSellPrice(card.rarity)} SS
</button>
</div>
</div>
</div>
))}
</div>

<div className="swipe-hint">
← swipe cards →
</div>
</>
)}

{activeTab === "collection" && (
<>
<div className="vault">
<p className="vault-kicker">PREMIUM VAULT</p>

<h2 className="vault-title">My Collection</h2>

<p className="vault-subtitle">
Cards owned: {totalCards}
</p>
</div>

<div className="scroll-row">
{collection.map((card) => (
<div
key={card.id}
className="card"
style={{
border: `2px solid ${card.color}`,
}}
onClick={() => setSelectedCard(card)}
>
<img
className="card-img"
src={card.image}
alt={card.name}
/>

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">
{card.rarity} · x{card.count}
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
style={{
border: `2px solid ${card.color}`,
}}
onClick={() => setSelectedCard(card)}
>
<img
className="card-img"
src={card.image}
alt={card.name}
/>

<div className="card-body">
<h3 className="card-name">{card.name}</h3>

<div className="card-meta">
{card.rarity}
</div>

<button
className="btn btn-gold"
style={{ marginTop: 12 }}
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
Buy · {card.price} SS
</button>
</div>
</div>
))}
</div>
</>
)}

{selectedCard && (
<div
className="modal"
onClick={() => setSelectedCard(null)}
>
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
{["home", "collection", "market"].map((tab) => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`nav-btn ${
activeTab === tab ? "active" : ""
}`}
>
{tab}
</button>
))}
</div>
</div>
);
}

