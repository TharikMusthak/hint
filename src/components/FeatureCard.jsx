import React, { useState } from 'react';

// ஒருவேளை உங்களிடம் useReveal இல்லையென்றால், 
// அதைத் தவிர்க்க இந்த simple logic-ஐ பயன்படுத்தலாம்.
const C = { text: "#ffffff", muted: "#9ca3af", emerald: "#10b981" };

export default function FeatureCard({ icon, title, body, delay = 0 }) {
 const [hovered, setHovered] = useState(false);

 return (
 <div
 onMouseEnter={() => setHovered(true)}
 onMouseLeave={() => setHovered(false)}
 style={{
// Glassmorphism Main Styles
 background: hovered 
   ? "rgba(255, 255, 255, 0.04)"
   : "rgba(255, 255, 255, 0.01)",
     backdropFilter: "blur(-1px) saturate(180%)", // iPhone Glass effect
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${hovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
    
    // Depth & Shape
    borderRadius: "24px",
    padding: "32px",
    transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
    transform: hovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
    
    // Shadows for Depth
    boxShadow: hovered
 ? "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.3)"
 : "0 8px 32px rgba(0,0,0,0.3)",
    
    cursor: "default",
  }}
>
  {/* Icon container */}
  <div style={{
    width: "48px", height: "48px", borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px", marginBottom: "20px",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
  }}>
    {icon}
  </div>

  <h3 style={{
    margin: "0 0 10px", fontSize: "18px", fontWeight: 600,
    color: "#ffffff", letterSpacing: "-0.01em"
  }}>{title}</h3>
  
  <p style={{
    margin: 0, fontSize: "14px", lineHeight: 1.6,
    color: "rgba(255,255,255,0.6)",
  }}>{body}</p>
</div>
  );
} 