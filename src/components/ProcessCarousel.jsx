import { useEffect, useState,useRef } from "react";

 export default function ProcessCarousel(processData) {
  const [current, setCurrent] = useState(0);
  const [cards, setCards] = useState(3);
function useReveal() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}
function TestimonialCard({ quote, name, process, index }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "16px",
      padding: "32px",
      backdropFilter: "blur(4px) saturate(140%)",
      WebkitBackdropFilter: "blur(4px) saturate(140%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 24px rgba(0,0,0,0.25)",
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(32px)",
      transition: `all 0.7s ${index * 120}ms cubic-bezier(0.23,1,0.32,1)`,
    }}>
 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
           background: `linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.8),
    transparent
  )`,
          border: `1px solid rgba(160,219,33,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700, color: "#e7e7e7",
        }}>{process}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>{name}</div>
         </div>
      </div>


      <div style={{ fontSize: "28px", color: "#A0DB21", marginBottom: "20px", lineHeight: 1 }}></div>
      <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: 1.7, margin: "0 0 28px", fontStyle: "italic" }}>
        {quote}
      </p>
     
    </div>
  );
}
 

const buttonStyle = (side) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: "12px", // left or right
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  border: "1px solid rgba(160,219,33,0.35)",
  background: "rgba(15,23,42,0.75)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#A0DB21",
  fontSize: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all .3s ease",
  zIndex: 10,
});
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) setCards(1);
      else if (window.innerWidth < 1024) setCards(2);
      else setCards(3);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % processData.processData
.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % processData
.processData
.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? processData.length - 1 : prev - 1
    );
  };

  const visible = [];

  for (let i = 0; i < cards; i++) {
    visible.push(processData.processData
[(current + i) % processData.processData
.length]);
  }
   return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cards},1fr)`,
          gap: 24
        }}
      >
        {visible
  .filter(Boolean)
  .map((item, index) => (
          <TestimonialCard
            key={item.process}
            {...item}
            index={index}
          />
        ))}
      </div>

      <button
        onClick={prev}
        style={buttonStyle("left")}
      >
        ❮
      </button>

      <button
        onClick={next}
        style={buttonStyle("right")}
      >
        ❯
      </button>
    </div>
  );
}