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

return (
<div
style={{
background:
"radial-gradient(circle at top, #191200 0%, #050505 38%, #000 100%)",
minHeight: "100vh",
color: "white",
paddingBottom: "120px",
overflowX: "hidden",
}}
>
<div
style={{
padding: "26px 20px 10px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 16,
}}
>
<div>
<h1
style={{
color: "#ffcc00",
margin: 0,
fontSize: 36,
fontWeight: 900,
lineHeight: 1,
}}
>
Swim Skills
</h1>

<p style={{ color: "#999", marginTop: 8, fontSize: 18 }}>
@whoissievers
</p>
</div>

<div
style={{
border: "2px solid #ffcc00",
borderRadius: 28,
padding: "10px 20px",
color: "#ffcc00",
fontWeight: 900,
fontSize: 24,
textAlign: "center",
minWidth: 110,
}}
>
{balance}
<br />
SS
</div>
</div>

{activeTab === "home" && (
<div style={{ padding: 20 }}>
<button
onClick={openStarterPack}
style={{
background: "linear-gradient(135deg, #ffcc00, #ffdf55)",
border: "none",
color: "#000",
padding: "22px 34px",
borderRadius: 26,
fontSize: 28,
fontWeight: 900,
cursor: "pointer",
width: "100%",
boxShadow: "0 0 30px rgba(255,204,0,0.25)",
}}
>
Open Starter Pack
</button>

<h2
style={{
color: "#ffcc00",
fontSize: 30,
marginTop: 46,
marginBottom: 18,
letterSpacing: 1,
fontWeight: 900,
}}
>
Your Pack
</h2>

<CardRow cards={collection} setSelectedCard={setSelectedCard} />
</div>
)}

{activeTab === "collection" && (
<div style={{ padding: 20 }}>
<div
style={{
border: "1px solid rgba(255,204,0,0.35)",
borderRadius: 28,
padding: 22,
background:
"linear-gradient(180deg, rgba(255,204,0,0.12), rgba(0,0,0,0.65))",
boxShadow: "0 0 40px rgba(255,204,0,0.12)",
marginBottom: 24,
}}
>
<p
style={{
color: "#ffcc00",
fontSize: 14,
fontWeight: 900,
letterSpacing: 3,
margin: 0,
}}
>
PREMIUM VAULT
</p>

<h2
style={{
color: "#fff",
fontSize: 34,
margin: "8px 0 8px",
fontWeight: 900,
}}
>
My Collection
</h2>

<p style={{ color: "#999", margin: 0, fontSize: 16 }}>
Cards owned: {collection.reduce((sum, c) => sum + c.count, 0)} ·
Unique: {collection.length}
</p>
</div>

{collection.length === 0 ? (
<p style={{ color: "#999", textAlign: "center", marginTop: 80 }}>
Your collection is empty. Open a starter pack first.
</p>
) : (
<div
style={{
display: "flex",
gap: 16,
overflowX: "auto",
paddingBottom: 20,
scrollSnapType: "x mandatory",
}}
>
{collection.map((card) => (
<div
key={card.id}
onClick={() => setSelectedCard(card)}
style={{
minWidth: "240px",
maxWidth: "240px",
background: "#111",
borderRadius: 22,
overflow: "hidden",
border: `2px solid ${card.color}`,
scrollSnapAlign: "start",
cursor: "pointer",
boxShadow: `0 0 24px ${card.color}55`,
}}
>
<img
src={card.image}
alt={card.name}
style={{ width: "100%", display: "block" }}
/>

<div style={{ padding: 14 }}>
<h3 style={{ margin: 0, fontSize: 18 }}>{card.name}</h3>

<p style={{ color: "#999", marginTop: 8 }}>
{card.rarity} · x{card.count}
</p>

<button
onClick={(e) => {
e.stopPropagation();
upgradeCard(card);
}}
style={{
width: "100%",
padding: 11,
borderRadius: 14,
border: "none",
background:
card.rarity === "GOAT"
? "#333"
: "linear-gradient(135deg,#ffcc00,#ffef8a)",
color: card.rarity === "GOAT" ? "#777" : "#000",
fontWeight: 900,
marginTop: 10,
}}
>
UPGRADE
</button>

<button
onClick={(e) => {
e.stopPropagation();
sellCard(card);
}}
style={{
width: "100%",
padding: 11,
borderRadius: 14,
background: "transparent",
border: "1px solid #ffcc00",
color: "#ffcc00",
fontWeight: 900,
marginTop: 8,
}}
>
SELL — {getSellPrice(card.rarity)} SS
</button>
</div>
</div>
))}
</div>
)}
</div>
)}

{activeTab === "market" && (
<div style={{ padding: 20 }}>
<h2 style={{ color: "#ffcc00", fontSize: 34, marginBottom: 18 }}>
Market
</h2>

<div
style={{
display: "flex",
gap: 16,
overflowX: "auto",
paddingBottom: 20,
scrollSnapType: "x mandatory",
}}
>
{marketCards.map((card) => (
<div
key={card.id}
onClick={() => setSelectedCard(card)}
style={{
minWidth: "240px",
maxWidth: "240px",
background: "#111",
borderRadius: 20,
overflow: "hidden",
border: `2px solid ${card.color}`,
scrollSnapAlign: "start",
cursor: "pointer",
}}
>
<img
src={card.image}
alt={card.name}
style={{ width: "100%", display: "block" }}
/>

<div style={{ padding: 16 }}>
<h3 style={{ margin: 0, fontSize: 20 }}>{card.name}</h3>

<p
style={{
color: card.color,
fontWeight: 800,
marginTop: 8,
}}
>
{card.rarity}
</p>

<button
onClick={(e) => {
e.stopPropagation();

if (balance < card.price) {
alert("Not enough SS");
return;
}

setBalance((prev) => prev - card.price);
addCardToCollection(card);
}}
style={{
width: "100%",
marginTop: 10,
padding: 12,
background: "#ffcc00",
border: "none",
borderRadius: 14,
fontWeight: 900,
fontSize: 16,
cursor: "pointer",
}}
>
BUY — {card.price} SS
</button>
</div>
</div>
))}
</div>
</div>
)}

{selectedCard && (
<div
onClick={() => setSelectedCard(null)}
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.92)",
zIndex: 999,
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
}}
>
<img
src={selectedCard.image}
alt={selectedCard.name}
style={{
width: "92%",
maxWidth: 420,
borderRadius: 24,
border: `3px solid ${selectedCard.color}`,
boxShadow: `0 0 40px ${selectedCard.color}`,
}}
/>
</div>
)}

<div
style={{
position: "fixed",
bottom: 0,
left: 0,
right: 0,
background: "#000",
borderTop: "1px solid #222",
display: "flex",
justifyContent: "space-around",
padding: "18px 0",
zIndex: 100,
}}
>
{["home", "collection", "market"].map((tab) => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
style={{
background: "none",
border: "none",
color: activeTab === tab ? "#ffcc00" : "#777",
fontSize: 22,
fontWeight: 900,
textTransform: "uppercase",
}}
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
<div
style={{
display: "flex",
gap: 16,
overflowX: "auto",
paddingBottom: 20,
scrollSnapType: "x mandatory",
}}
>
{cards.map((card) => (
<div
key={card.id}
onClick={() => setSelectedCard(card)}
style={{
minWidth: "240px",
maxWidth: "240px",
border: `2px solid ${card.color}`,
borderRadius: 20,
overflow: "hidden",
background: "#111",
scrollSnapAlign: "start",
cursor: "pointer",
}}
>
<img
src={card.image}
alt={card.name}
style={{ width: "100%", display: "block" }}
/>

<div style={{ padding: 14 }}>
<h3 style={{ margin: 0, fontSize: 18 }}>{card.name}</h3>
<p style={{ color: "#999", marginTop: 8 }}>x{card.count}</p>
</div>
</div>
))}
</div>
);
}

