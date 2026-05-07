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
name: "Matt Evans",
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
c.id === randomCard.id
? { ...c, count: c.count + 1 }
: c
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
padding: "30px 20px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}
>
<div>
<h1
style={{
color: "#ffcc00",
margin: 0,
fontSize: 42,
fontWeight: 900,
}}
>
Swim Skills
</h1>

<p style={{ color: "#999", marginTop: 4 }}>
@whoissievers
</p>
</div>

<div
style={{
border: "2px solid #ffcc00",
borderRadius: 30,
padding: "12px 24px",
color: "#ffcc00",
fontWeight: 800,
fontSize: 28,
}}
>
{balance} SS
</div>
</div>

{activeTab === "home" && (
<div
style={{
padding: 20,
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 40,
}}
>
<button
onClick={openStarterPack}
style={{
background: "#ffcc00",
border: "none",
color: "#000",
padding: "28px 60px",
borderRadius: 28,
fontSize: 34,
fontWeight: 900,
cursor: "pointer",
}}
>
Open Starter Pack
</button>

<div style={{ width: "100%" }}>
<h2
style={{
color: "#ffcc00",
fontSize: 48,
marginBottom: 20,
}}
>
Your Pack
</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr",
gap: 20,
}}
>
{collection.map((card) => (
<div
key={card.id}
style={{
border: `2px solid ${card.color}`,
borderRadius: 20,
overflow: "hidden",
background: "#111",
}}
>
<img
src={card.image}
style={{
width: "100%",
display: "block",
}}
/>

<div style={{ padding: 16 }}>
<h3 style={{ margin: 0 }}>{card.name}</h3>

<p style={{ color: "#999" }}>
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
fontSize: 48,
marginBottom: 20,
}}
>
MARKET
</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr",
gap: 20,
}}
>
{marketCards.map((card) => (
<div
key={card.id}
style={{
background: "#111",
borderRadius: 20,
overflow: "hidden",
border: `2px solid ${card.color}`,
}}
>
<img
src={card.image}
style={{
width: "100%",
display: "block",
}}
/>

<div style={{ padding: 20 }}>
<h3
style={{
margin: 0,
fontSize: 30,
}}
>
{card.name}
</h3>

<p
style={{
color: card.color,
fontWeight: 700,
}}
>
{card.rarity}
</p>

<button
style={{
width: "100%",
marginTop: 10,
padding: 16,
background: "#ffcc00",
border: "none",
borderRadius: 16,
fontWeight: 800,
fontSize: 22,
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
fontSize: 48,
marginBottom: 20,
}}
>
COLLECTION
</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr",
gap: 20,
}}
>
{collection.map((card) => (
<div
key={card.id}
style={{
background: "#111",
borderRadius: 20,
overflow: "hidden",
border: `2px solid ${card.color}`,
}}
>
<img
src={card.image}
style={{
width: "100%",
display: "block",
}}
/>
</div>
))}
</div>
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
}}
>
<button
onClick={() => setActiveTab("home")}
style={{
background: "none",
border: "none",
color:
activeTab === "home" ? "#ffcc00" : "#777",
fontSize: 24,
fontWeight: 800,
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
fontWeight: 800,
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
fontWeight: 800,
}}
>
MARKET
</button>
</div>
</div>
);
}

