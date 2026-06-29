import React, { useState } from "react";

export default function FeatureCard({
  icon,
  title,
  body,
  delay = 0,
  darkMode = true,
}) {
  const [hovered, setHovered] = useState(false);

  const theme = darkMode
    ? {
        bg: hovered
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.02)",

        border: hovered
          ? "rgba(255,255,255,0.25)"
          : "rgba(255,255,255,0.08)",

        title: "#FFFFFF",

        text: "rgba(255,255,255,0.72)",

        iconBg: "rgba(255,255,255,0.05)",

        iconBorder: "rgba(255,255,255,0.10)",

        shadow: hovered
          ? "0 20px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(16,185,129,.35)"
          : "0 8px 30px rgba(0,0,0,.35)",
      }
    : {
        bg: hovered
          ? "rgba(255,255,255,.95)"
          : "rgba(255,255,255,.82)",

        border: hovered
          ? "rgba(16,24,40,.12)"
          : "rgba(16,24,40,.08)",

        title: "#111827",

        text: "#4B5563",

        iconBg: "rgba(16,24,40,.04)",

        iconBorder: "rgba(16,24,40,.08)",

        shadow: hovered
          ? "0 20px 40px rgba(0,0,0,.10)"
          : "0 8px 24px rgba(0,0,0,.06)",
      };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.bg,

        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",

        border: `1px solid ${theme.border}`,

        borderRadius: "24px",

        padding: "32px",

        transition: "all .45s cubic-bezier(.23,1,.32,1)",

        transform: hovered
          ? "translateY(-10px) scale(1.02)"
          : "translateY(0)",

        boxShadow: theme.shadow,

        cursor: "default",

        position: "relative",

        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(16,185,129,.10), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,

          borderRadius: 16,

          background: theme.iconBg,

          border: `1px solid ${theme.iconBorder}`,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          fontSize: 22,

          marginBottom: 22,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 12px",

          fontSize: 20,

          fontWeight: 700,

          color: theme.title,

          letterSpacing: "-.02em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,

          fontSize: 15,

          lineHeight: 1.7,

          color: theme.text,
        }}
      >
        {body}
      </p>
    </div>
  );
}