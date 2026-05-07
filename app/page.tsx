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

export default function Home() {
const [balance, setBalance] = useState(1675);

const [collection, setCollection] = useState<CollectionItem[]>([]);

const [activeTab, setActiveTab] = useState("home");

const [selectedCard, setSelectedCard] = useState<Card | null>(null);

useEffect(() => {
const savedCollection = localStorage.getItem("collection");

const savedBalance = localStorage.getItem("balance");

if (savedCollection) {
setCollection(JSON.parse(savedCollection));
}

if (savedBalance) {
setBalance(Number(savedBalance));
}
}, []);

useEffect(() => {
localStorage.setItem("collection", JSON.stringify(collection));

localStorage.setItem("balance", balance.toString());
}, [collection, balance]);

const openStarterPack = () => {
const randomCard =
marketCards[Math.floor(Math.random() * marketCards.length)];

setCollection((prev) => {
const existing = prev.find((c) => c.id === randomCard.id);

if (existing) {
return prev.map((c) =>
c.id === randomCard.id ? { ...c, count: c.count + 1 } : c
);
}

return [...prev, { ...randomCard, count: 1 }];
});
};

return (
<div
style={{
background: "#000",
minHeight: "100vh",
color: "white",
paddingBottom: "120px",
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

<p
style={{
color: "#999",
marginTop: 8,
fontSize: 18,
}}
>
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
<div
style={{
padding: 20,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 34,
}}
>
<button
onClick={openStarterPack}
style={{
background: "#ffcc00",
border: "none",
color: "#000",
padding: "24px 40px",
borderRadius: 26,
fontSize: 30,
fontWeight: 900,
cursor: "pointer",
width: "100%",
maxWidth: 520,
}}
>
Open Starter Pack
</button>

<div style={{ width: "100%" }}>
<h2
style={{
color: "#ffcc00",
fontSize: 42,
marginBottom: 18,
}}
>
Your Pack
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
{collection.map((card) => (
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
style={{
width: "100%",
display: "block",
}}
/>

<div style={{ padding: 14 }}>
<h3 style={{ margin: 0, fontSize: 18 }}>
{card.name}
</h3>

<p
style={{
color: "#999",
marginTop: 8,
}}
>
x{card.count}
</p>
</div>
</div>
))}
</div>
</div>
</div>
)}

{activeTab === "market" && (
<div style={{ padding: 20 }}>
<h2
style={{
color: "#ffcc00",
fontSize: 42,
marginBottom: 18,
}}
>
MARKET
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
style={{
width: "100%",
display: "block",
}}
/>

<div style={{ padding: 16 }}>
<h3
style={{
margin: 0,
fontSize: 20,
}}
>
{card.name}
</h3>

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

setCollection((prev) => {
const existing = prev.find(
(c) => c.id === card.id
);

if (existing) {
return prev.map((c) =>
c.id === card.id
? {
...c,
count: c.count + 1,
}
: c
);
}

return [...prev, { ...card, count: 1 }];
});
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

{activeTab === "collection" && (
<div style={{ padding: 20 }}>
<h2
style={{
color: "#ffcc00",
fontSize: 42,
marginBottom: 18,
}}
>
COLLECTION
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
{collection.map((card) => (
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
style={{
width: "100%",
display: "block",
}}
/>

<div style={{ padding: 14 }}>
<h3 style={{ margin: 0, fontSize: 18 }}>
{card.name}
</h3>

<p
style={{
color: "#999",
marginTop: 8,
}}
>
x{card.count}
</p>
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
<button
onClick={() => setActiveTab("home")}
style={{
background: "none",
border: "none",
color: activeTab === "home" ? "#ffcc00" : "#777",
fontSize: 24,
fontWeight: 900,
}}
>
HOME
</button>

<button
onClick={() => setActiveTab("collection")}
style={{
background: "none",
border: "none",
color:
activeTab === "collection"
? "#ffcc00"
: "#777",
fontSize: 24,
fontWeight: 900,
}}
>
COLLECTION
</button>

<button
onClick={() => setActiveTab("market")}
style={{
background: "none",
border: "none",
color:
activeTab === "market"
? "#ffcc00"
: "#777",
fontSize: 24,
fontWeight: 900,
}}
>
MARKET
</button>
</div>
</div>
);
}

