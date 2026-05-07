"use client";

import Image from "next/image";
import { useState } from "react";
import {
Home,
Library,
ShoppingCart,
Newspaper,
ChevronLeft,
ChevronRight,
} from "lucide-react";

type Card = {
id: string;
name: string;
image: string;
rarity: string;
color: string;
amount: number;
};

const cards: Card[] = [
{
id: "summer",
name: "Summer McIntosh",
image: "/summer-card.png",
rarity: "GOAT",
color: "#f6c343",
amount: 7,
},
{
id: "ledecky",
name: "Katie Ledecky",
image: "/ledecky-card.png",
rarity: "GOAT",
color: "#4da3ff",
amount: 5,
},
{
id: "mckeown",
name: "Kaylee McKeown",
image: "/mckeown-card.png",
rarity: "GOAT",
color: "#4dff88",
amount: 3,
},
{
id: "douglass",
name: "Kate Douglass",
image: "/douglass-card.png",
rarity: "Elite",
color: "#b06cff",
amount: 2,
},
{
id: "angharad",
name: "Angharad Evans",
image: "/evans-card.png",
rarity: "Rare",
color: "#ff7b54",
amount: 1,
},
];

export default function HomePage() {
const [selectedCard, setSelectedCard] = useState<string | null>(null);

return (
<main
style={{
background: "#000",
minHeight: "100vh",
color: "white",
paddingBottom: 120,
}}
>
{/* HEADER */}
<div
style={{
padding: "24px 20px 8px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "flex-start",
}}
>
<div>
<h1
style={{
fontSize: 42,
fontWeight: 800,
color: "#ffcc00",
margin: 0,
lineHeight: 1,
}}
>
Swim
<br />
Skills
</h1>

<p
style={{
color: "#888",
marginTop: 10,
fontSize: 18,
}}
>
@whoissievers
</p>
</div>

<div
style={{
border: "3px solid #ffcc00",
borderRadius: 30,
padding: "18px 26px",
minWidth: 140,
textAlign: "center",
}}
>
<div
style={{
fontSize: 44,
fontWeight: 800,
color: "#ffcc00",
}}
>
1675
</div>

<div
style={{
fontSize: 28,
fontWeight: 700,
color: "#ffcc00",
}}
>
SS
</div>
</div>
</div>
</div>

{/* YOUR PACK HEADER */}
<div
style={{
padding: "12px 20px 10px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}
>
<h2
style={{
fontSize: 34,
color: "#ffcc00",
margin: 0,
fontWeight: 700,
}}
>
Your Pack
</h2>

<button
style={{
background: "#ffcc00",
border: "none",
borderRadius: 18,
padding: "10px 16px",
color: "#000",
fontWeight: 700,
fontSize: 14,
cursor: "pointer",
}}
>
Open Pack
</button>
</div>

{/* CARDS */}
<div
style={{
overflowX: "auto",
display: "flex",
gap: 18,
padding: "10px 20px 0",
scrollSnapType: "x mandatory",
}}
>
{cards.map((card) => {
const expanded = selectedCard === card.id;

return (
<div
key={card.id}
onClick={() =>
setSelectedCard(expanded ? null : card.id)
}
style={{
minWidth: expanded ? 320 : 250,
transition: "0.3s",
scrollSnapAlign: "start",
cursor: "pointer",
}}
>
<div
style={{
background: "#070707",
border: `3px solid ${card.color}`,
borderRadius: 28,
overflow: "hidden",
boxShadow: `0 0 25px ${card.color}55`,
}}
>
<Image
src={card.image}
alt={card.name}
width={500}
height={700}
style={{
width: "100%",
height: "auto",
display: "block",
}}
/>

<div
style={{
padding: 18,
}}
>
<div
style={{
fontSize: 16,
color: card.color,
fontWeight: 700,
marginBottom: 6,
}}
>
{card.rarity}
</div>

<div
style={{
fontSize: expanded ? 30 : 24,
fontWeight: 700,
lineHeight: 1.1,
}}
>
{card.name}
</div>

<div
style={{
color: "#777",
fontSize: 18,
marginTop: 8,
}}
>
x{card.amount}
</div>

{expanded && (
<div
style={{
display: "flex",
gap: 12,
marginTop: 18,
}}
>
<button
style={{
flex: 1,
background: "#ffcc00",
border: "none",
borderRadius: 14,
padding: "12px 0",
color: "#000",
fontWeight: 700,
cursor: "pointer",
}}
>
Upgrade
</button>

<button
style={{
flex: 1,
background: "#111",
border: `2px solid ${card.color}`,
borderRadius: 14,
padding: "12px 0",
color: card.color,
fontWeight: 700,
cursor: "pointer",
}}
>
Sell
</button>
</div>
)}
</div>
</div>
</div>
);
})}
</div>

{/* SCROLL HINT */}
<div
style={{
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: 10,
marginTop: 16,
color: "#666",
fontSize: 14,
}}
>
<ChevronLeft size={18} />
Swipe cards
<ChevronRight size={18} />
</div>

{/* COLLECTION */}
<div
style={{
marginTop: 40,
padding: "0 20px",
}}
>
<div
style={{
background:
"linear-gradient(145deg,#0a0a0a,#111111)",
border: "2px solid #ffcc00",
borderRadius: 28,
padding: 22,
boxShadow: "0 0 25px rgba(255,204,0,0.15)",
}}
>
<div
style={{
color: "#ffcc00",
fontSize: 28,
fontWeight: 700,
marginBottom: 18,
}}
>
Collection
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: 14,
}}
>
{cards.map((card) => (
<div
key={card.id}
style={{
background: "#050505",
border: `2px solid ${card.color}`,
borderRadius: 20,
overflow: "hidden",
}}
>
<Image
src={card.image}
alt={card.name}
width={300}
height={420}
style={{
width: "100%",
height: "auto",
}}
/>

<div
style={{
padding: 10,
}}
>
<div
style={{
fontWeight: 700,
fontSize: 14,
}}
>
{card.name}
</div>

<div
style={{
color: "#777",
marginTop: 4,
fontSize: 12,
}}
>
{card.rarity}
</div>
</div>
</div>
))}
</div>
</div>
</div>

{/* BOTTOM NAV */}
<div
style={{
position: "fixed",
bottom: 16,
left: 16,
right: 16,
background:
"linear-gradient(180deg,#111,#0a0a0a)",
borderRadius: 32,
border: "1px solid #222",
display: "flex",
justifyContent: "space-around",
alignItems: "center",
padding: "14px 8px",
zIndex: 100,
boxShadow: "0 0 30px rgba(0,0,0,0.5)",
}}
>
<NavItem
icon={<Home size={20} />}
label="Home"
active
/>

<NavItem
icon={<Library size={20} />}
label="Collection"
/>

<NavItem
icon={<ShoppingCart size={20} />}
label="Market"
/>

<NavItem
icon={<Newspaper size={20} />}
label="News"
/>
</div>
</main>
);
}

function NavItem({
icon,
label,
active = false,
}: {
icon: React.ReactNode;
label: string;
active?: boolean;
}) {
return (
<div
style={{
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 6,
color: active ? "#ffcc00" : "#666",
fontSize: 12,
fontWeight: 700,
}}
>
{icon}
{label}
</div>
);
}

