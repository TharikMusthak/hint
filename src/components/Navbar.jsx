import { motion } from "framer-motion";
 import { useRef, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  Logo,
  C,
  NavItems,
  navTop,
  navWidth,
  navHeight,
  navPadding,
  navRadius,
  darkMode,
  setDarkMode,
}) {

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 800);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

 
const [menuOpen, setMenuOpen] = useState(false);
function MagneticButton({ children, onClick, style = {} }) {
  const ref = useRef();

  const handleMove = e => {
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    ref.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
  };

  const handleLeave = () => {
    ref.current.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)",
        cursor: "pointer",
        border: "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}


return (
  <>
    {!isMobile ? (
      // =======================
      // YOUR EXISTING DESKTOP NAVBAR
      // Paste your current <motion.nav> here
      // DO NOT CHANGE ANYTHING
      // =======================

<div>

 
      
       <motion.nav
      style={{
        position: "fixed",
        top: navTop,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,

        width: navWidth,
        height: navHeight,
        padding: navPadding,

        borderRadius: navRadius,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",

         background:
            "linear-gradient(90deg, transparent, transparent)",

          backdropFilter: "blur(1.5px) saturate(100%)",
          WebkitBackdropFilter: "blur(5px) saturate(100%)",
        border: "1px solid rgba(255,255,255,0.12)",

        boxShadow:
          "rgba(0,0,0,.1) 0 0 20px, rgba(255,255,255,.12) 0 1px 0 inset, rgba(255,255,255,.03) 0 -1px 0 inset",

        overflow: "hidden",

        maxWidth: "1300px",
      }}
    >
    
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "clamp(80px,10vw,110px)",
          }}
        />
      </div>

      {/* Links */}
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          gap: "clamp(12px,2vw,30px)",
        }}
      >
        {NavItems.map((item) => (
          <motion.a
            key={item}
            whileHover={{ y: -2, color: C.text }}
            href={`#${item.replaceAll(" ", "").toLowerCase()}`}
            style={{
              textDecoration: "none",
              color: C.text,
              fontSize: "clamp(13px,1vw,15px)",
              fontWeight: 500,
            }}
          >
            {item}
          </motion.a>
        ))}
      </div>
      <div
      style={{  
          top:"30px",
          marginRight: "50px"}}
      
      ><ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      </div>

      {/* Contact Button */}
      <a href="#contact">
        <MagneticButton
          style={{
            background:
              "linear-gradient(135deg,#B3FF10 0%,#A0DB21 100%)",
            color: C.text,
            padding: "10px 22px",
            borderRadius: "999px",
            fontWeight: 700,
            boxShadow: "0 0 20px rgba(160,219,33,.35)",
          }}
        >
          Contact Us
        </MagneticButton>
      </a>
    </motion.nav>

    </div>
    ) : (
      // =======================
      // MOBILE NAVBAR
      // =======================
      <>
        <motion.nav
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "92%",
            height: 70,
            padding: "0 18px",
            borderRadius: navRadius,
            zIndex: 100,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

             background:
            "linear-gradient(90deg, transparent, transparent)",

          backdropFilter: "blur(1.5px) saturate(100%)",
          WebkitBackdropFilter: "blur(1.5px) saturate(100%)",
  boxShadow:
          "rgba(0,0,0,.1) 0 0 20px, rgba(255,255,255,.12) 0 1px 0 inset, rgba(255,255,255,.03) 0 -1px 0 inset",

        overflow: "hidden",

            border: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <img
            src={Logo}
            alt=""
            style={{
              width: 90,
            }}
          />

      <div
  style={{
    display: "flex",
    alignItems: "center",
    
    gap: 12,
  }}
>
  <div
    style={{
      width: 42,
      height: 42,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
    }}
  >
    <ThemeToggle
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  </div>

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    style={{
      background: "transparent",
      border: "none",
      color: C.text,
      fontSize: 28,
      cursor: "pointer",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      zIndex: 1000,
    }}
  >
    {menuOpen ? "✕" : "☰"}
  </button>
</div>
        </motion.nav>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 100,
              left: "0%",
              transform: "translateX(-50%)",
              width: "100%",
                 background:
            "linear-gradient(90deg, transparent, transparent)",

          backdropFilter: "blur( 15px) saturate(100%)",
          WebkitBackdropFilter: "blur(15px) saturate(100%)",
              borderRadius: 18,
              padding: 25,
              zIndex: 99,

              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {NavItems.map((item) => (
              <a
                key={item}
                href={`#${item.replaceAll(" ", "").toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: C.text,
                  textDecoration: "none",
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {item}
              </a>
            ))}
      

          <a href="#contact"  style={{
                background:
                  "linear-gradient(135deg,#B3FF10,#A0DB21)",
                color: C.text,
                borderRadius: 999,
                padding: "14px 20px",
                fontWeight: 700,
                textAlign: "center",
              }}>   
             
           
             Contact Us
             </a>
          </motion.div>
        )}
      </>
    )}
  </>
);
}