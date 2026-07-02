import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import FeatureCard from './components/FeatureCard';
import LightLogo from './assets/images/Hint_light_logo.svg';
import DarkLogo from './assets/images/Hint_dark_logo.svg';
import icon from './assets/Loader.svg';
import { motion, useScroll, useTransform } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import Marquee from "./components/Marquee";
import ContactForm from "./components/ContactForm";

import ProcessCarousel from "./components/ProcessCarousel";

 const lerp = (a, b, t) => a + (b - a) * t;

// const C = {
//   emerald: "#A0DB21",
//   emeraldDim: "#A0DB21",
//   emeraldGlow: "#A0DB21",
//   bg: "#040C02",
//   loadingscreen :"#000000",
//   bgMid: "#050d1a",
//   text: "#f8fafc",
//   muted: "#d8d8d8",
//   glass: "rgba(8,16,30,0.6)",
// };
const processData = [
  {
    quote: "Understanding your business, users, and objectives.",
    name: "Discover",
    process: "1"
  },
  {
    quote: "Creating wireframes, UI concepts, and seamless user experiences.",
    name: "Design",
    process: "2"
  },
  {
    quote: "Building fast, scalable, and responsive digital solutions.",
    name: "Develop",
    process: "3"
  },
  {
    quote: "Testing, optimizing, and ensuring everything works flawlessly.",
    name: "Refine",
    process: "4"
  },
  {
    quote: "Launching your project and providing ongoing support for growth.",
    name: "Deliver",
    process: "5"
  }
];

const themes = {
  dark: {
    emerald: "#A0DB21",
    emeraldDim: "#A0DB21",
    emeraldGlow: "#A0DB21",

    bg: "#040C02",
    bgMid: "#050d1a",
    text: "#f8fafc",
    muted: "#d8d8d8",

    glass: "rgba(8,16,30,.6)",
    loading: "#000",

    nav: "rgba(4,12,2,.45)",
    border: "rgba(255,255,255,.12)",
    card: "rgba(255,255,255,.05)",

    scrollbar: "#040C02"
  },

  light: {
    emerald: "#7DB800",
    emeraldDim: "#7DB800",
    emeraldGlow: "#7DB800",

    bg: "#F6F8FB",
    bgMid: "#FFFFFF",

    text: "#111827",
    muted: "#5B6472",

    glass: "rgba(255,255,255,.65)",
    loading: "#ffffff",

    nav: "rgba(255,255,255,.75)",
    border: "rgba(0,0,0,.08)",
    card: "rgba(255,255,255,.75)",

    scrollbar: "#E5E7EB"
  }
};


/* ═══════════════════════════════════════════
   WEBGL CANVAS
   ═══════════════════════════════════════════ */
function useScene(canvasRef, darkMode) {
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,

    // 🚀 ZOOM CONTROL ADDED
    // Camera
    targetZ: 1.8,
    currentZ: 1.8,

    // Earth vertical animation
    targetEarthY: -1.25,
    currentEarthY: -1.25,

    // Fade
    targetOpacity: 1,
    currentOpacity: 1,

    frame: 60,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // =====================
    // SCENE
    // =====================
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(darkMode ? 0x02040a : 0x0b1220, 6, 18);

    // =====================
    // CAMERA
    // =====================
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
camera.position.set(0,0,1.8);
    // =====================
    // RENDERER
    // =====================
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = darkMode ? 0.9 : 1.6;
    // =====================
    // TEXTURES
    // =====================
    const loader = new THREE.TextureLoader();

 
const earthDay = loader.load(
  "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
);

const earthNight = loader.load(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png"
);
    const heightMap = loader.load(
      "https://cdn.jsdelivr.net/gh/turban/webgl-earth/data/elev_bump_4k.jpg"
    );

    const normalMap = loader.load(
      "https://threejs.org/examples/textures/earth_normalmap_flat.jpg"
    );
earthDay.colorSpace = THREE.SRGBColorSpace;
earthNight.colorSpace = THREE.SRGBColorSpace;

   const earthTexture = darkMode ? earthNight : earthDay;


    // =====================
    // EARTH
    // =====================
  const globeMaterial = darkMode
  ? new THREE.MeshBasicMaterial({
      map: earthNight,
        color: new THREE.Color("#a0db21"), // Tint the entire texture

    })
  : new THREE.MeshStandardMaterial({
      map: earthDay,
      displacementMap: heightMap,
      displacementScale: 0.06,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughness: 0.8,
      metalness: 0.0,
    });

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1.45, 384, 384),
  globeMaterial
);

    scene.add(globe);
    globe.position.y = -1.25;
     // =====================
    // ATMOSPHERE
    // =====================
   const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.12, 256, 256),
  new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,

    uniforms: {
      glowColor: {
        value: new THREE.Color(darkMode ? 0xa0db21 : 0x66b3ff),
      },
      intensity: {
    value: darkMode ? 8.0 : 2.0,
}
    },

    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(position,1.0);
      }
    `,

   fragmentShader: `
uniform vec3 glowColor;
uniform float intensity;

varying vec3 vNormal;

void main() {

    float fresnel =
        pow(
            1.0 - max(dot(vNormal, vec3(0.0,0.0,-1.0)), 0.0),
            2.2
        );

    fresnel *= intensity;

    gl_FragColor = vec4(glowColor, fresnel * 0.35);
}
`,
  })
);

scene.add(atmosphere);

    // =====================
    // LIGHTING
    // =====================
const sun = new THREE.DirectionalLight(
    0xffffff,
    darkMode ? 0.2 : 3.2
);    sun.position.set(8, 4, 6);
    scene.add(sun);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        darkMode ? 0.1 : 0.8
    )
);

// =====================
// GREEN SUN GLOW
// =====================
// =====================
// INTENSE GREEN SUN GLOW
// =====================
const glowTexture = loader.load(
  "https://threejs.org/examples/textures/sprites/glow.png"
);
 



    // =====================
    // STARS
    // =====================
    // =====================
    // 🌟 ENHANCED STARS (MORE VISIBLE + CINEMATIC)
    // =====================
    const starGeo = new THREE.BufferGeometry();
    const starArr = [];
    const starSizes = [];

    const starCount = 8000; // increased density

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;

      starArr.push(x, y, z);

      // 🌟 random brightness feel
      starSizes.push(Math.random() * 1.2 + 0.3);
    }

    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starArr, 3)
    );

    // attach size as attribute (for shader-like variation)
    starGeo.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(starSizes, 1)
    );

   const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({
    color: darkMode ? 0xffffff : 0xa0db21, // White in dark mode, #a0db21 in light mode
size: darkMode ? 0.04 : 0.055,    sizeAttenuation: true,
    transparent: true,
    opacity: darkMode ? 0.95 : 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);

    scene.add(stars);

    // =====================
    // MOUSE PARALLAX
    // =====================
    const onMouseMove = (e) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // =====================
    // 🚀 ZOOM OUT (SCROLL CONTROL)
    // =====================
    const onScroll = () => {
      const scroll = window.scrollY;

      // First 400px -> bring Earth upward
      const moveProgress = Math.min(scroll / 400, 1);

      stateRef.current.targetEarthY =
        -1.25 + moveProgress * 1.25;

      // After Earth reaches center, zoom out
      const zoomProgress = Math.max(scroll - 400, 0);

      stateRef.current.targetZ =
        1.8 + zoomProgress * 0.0045;

      // Fade Earth slowly
      stateRef.current.targetOpacity =
        Math.max(0, 1 - zoomProgress * 0.002);

      // Stars become brighter
      stars.material.opacity =
        Math.min(1, 0.35 + zoomProgress * 0.0015);
    };

    window.addEventListener("scroll", onScroll);

    // =====================
    // RESIZE
    // =====================
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // =====================
    // ANIMATION LOOP
    // =====================
    const animate = () => {
      stateRef.current.frame = requestAnimationFrame(animate);

      // mouse smoothing
      stateRef.current.targetX +=
        (stateRef.current.mouseX - stateRef.current.targetX) * 0.03;

      stateRef.current.targetY +=
        (stateRef.current.mouseY - stateRef.current.targetY) * 0.03;

      // 🌍 rotation
      globe.rotation.y += 0.0008;
      atmosphere.rotation.y += 0.0008;
atmosphere.rotation.copy(globe.rotation);
atmosphere.position.copy(globe.position);
      // 🚀 SMOOTH ZOOM OUT (IMPORTANT PART)
      stateRef.current.currentZ +=
        (stateRef.current.targetZ - stateRef.current.currentZ) * 0.05;

      camera.position.z = stateRef.current.currentZ;

      // 🎥 parallax camera
      camera.position.x = stateRef.current.targetX * 0.35;
      camera.position.y = stateRef.current.targetY * 0.25;
      // Earth moves upward smoothly
      stateRef.current.currentEarthY +=
        (stateRef.current.targetEarthY -
          stateRef.current.currentEarthY) *
        0.06;

      globe.position.y = stateRef.current.currentEarthY;
      atmosphere.position.y = stateRef.current.currentEarthY;

stateRef.current.currentOpacity +=
  (stateRef.current.targetOpacity -
    stateRef.current.currentOpacity) *
  0.05;

globe.material.opacity = stateRef.current.currentOpacity;
globe.material.transparent = true;

atmosphere.material.opacity =
  stateRef.current.currentOpacity * 0.8;
atmosphere.scale.set(1.08, 1.08, 1.08);
      camera.lookAt(0, 0, 0);

      // 🌌 stars drift
      stars.rotation.y += 0.00015;

      renderer.render(scene, camera);
    };
  animate();

    // =====================
    // CLEANUP
    // =====================
    return () => {
      cancelAnimationFrame(stateRef.current.frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      scene.clear();
      renderer.dispose();
    };
  }, [canvasRef, darkMode]);
}
/* ═══════════════════════════════════════════
   MAGNETIC BUTTON
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   SCROLL-REVEAL HOOK
   ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   STAT COUNTER
   ═══════════════════════════════════════════ */
function Counter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal();

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   MINI CANVAS 3D
   ═══════════════════════════════════════════ */
function MiniCanvas3D({ type }) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const C = darkMode ? themes.dark : themes.light;

  useEffect(() => {

    const saved = localStorage.getItem("theme");

    if (saved) {
      setDarkMode(saved === "dark");
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current || !inView) return;
    const canvas = ref.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(
      darkMode ? 0x000000 : 0xffffff,
      0
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const light = new THREE.PointLight(0xA0DB21, 60, 20);
    light.position.set(2, 3, 4);
    scene.add(light, new THREE.AmbientLight(0xA0DB21, 3));

    let mesh, mesh2, raf, t = 0;

    if (type === "verify") {
      const geo = new THREE.TorusKnotGeometry(1.1, 0.3, 120, 16, 2, 3);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x5d8310, metalness: 0.95, roughness: 0.08,
        emissive: 0x5d8310, emissiveIntensity: 0.3,
      });
      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      const wireGeo = new THREE.TorusKnotGeometry(1.12, 0.305, 80, 12, 2, 3);
      mesh2 = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({
        color: 0x5d8310, wireframe: true, transparent: true, opacity: 0.12
      }));
      scene.add(mesh2);

    } else if (type === "compute") {
      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 2),
        new THREE.MeshPhysicalMaterial({
          color: 0x5d8310, metalness: 0.8, roughness: 0.2,
          emissive: 0x5d8310, emissiveIntensity: 0.2,
        })
      );
      scene.add(mesh);
      mesh2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.52, 2),
        new THREE.MeshBasicMaterial({ color: 0xA0DB21, wireframe: true, transparent: true, opacity: 0.35 })
      );
      scene.add(mesh2);

    } else {
      const group = new THREE.Group();
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 32, 32),
        new THREE.MeshPhysicalMaterial({
          color: 0x030712, metalness: 0.9, roughness: 0.1,
          emissive: 0x10b981, emissiveIntensity: 0.4,
        })
      );
      group.add(mesh);
      [[1.8, 0.5], [1.4, 1.4], [0, 1.9], [-1.4, 1.2], [-1.8, 0], [-1.3, -1.5], [0.5, -1.8]].forEach(([x, y]) => {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x10b981 })
        );
        s.position.set(x, y, 0);
        group.add(s);
        group.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)]),
          new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.3 })
        ));
      });
      scene.add(group);
      mesh2 = group;
    }

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.01;
      if (mesh) { mesh.rotation.x = t * 0.4; mesh.rotation.y = t * 0.6; }
      if (mesh2 && type !== "agent") { mesh2.rotation.x = t * 0.4; mesh2.rotation.y = t * 0.6; }
      if (type === "agent") mesh2.rotation.z = t * 0.2;
      light.position.x = Math.sin(t) * 3;
      light.position.y = Math.cos(t * 0.7) * 3;
      renderer.render(scene, camera);
    };
    animate();

    return () => { cancelAnimationFrame(raf); renderer.dispose(); };
  }, [inView, type]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

/* ═══════════════════════════════════════════
   GLITCH TEXT
   ═══════════════════════════════════════════ */
function GlitchText({ text, style = {} }) {
  const [glitch, setGlitch] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const C = darkMode ? themes.dark : themes.light;

  useEffect(() => {

    const saved = localStorage.getItem("theme");

    if (saved) {
      setDarkMode(saved === "dark");
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "inline-block", position: "relative",
      ...style,
      ...(glitch ? { textShadow: `2px 0 ${C.emeraldGlow}, -2px 0 #0ea5e9` } : {}),
      transition: "text-shadow 0.05s",
    }}>
      {text}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════ */
function Typewriter({ strings, speed = 55 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const C = darkMode ? themes.dark : themes.light;

  useEffect(() => {

    const saved = localStorage.getItem("theme");

    if (saved) {
      setDarkMode(saved === "dark");
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);
  useEffect(() => {
    const current = strings[idx];
    const delay = deleting ? speed * 0.4 : speed;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setIdx(i => (i + 1) % strings.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, strings, speed]);

  return (
    <span style={{fontFamily:"Consolas, Monaco, 'Courier New', monospace; !important"}}>
      {display}
      <span style={{
        display: "inline-block", width: "2px", height: "1em",
        background: C.emerald, marginLeft: "2px", verticalAlign: "middle",
        animation: "blink 0.9s step-end infinite",
      }} />
    </span>
  );
}

/* ═══════════════════════════════════════════
   LIQUID GLASS PANEL — reusable wrapper
   ═══════════════════════════════════════════ */
function GlassPanel({ children, height = "420px", accentColor = "rgba(16,185,129,0.04)", style = {} }) {
  return (
    <div style={{
      height,
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(4px) saturate(160%) brightness(1.04)",
      WebkitBackdropFilter: "blur(4px) saturate(160%) brightness(1.04)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: `
        inset 0 1.5px 0 rgba(255,255,255,0.18),
        inset 0 -1px 0 rgba(0,0,0,0.12),
        inset 1px 0 0 rgba(255,255,255,0.06),
        0 8px 32px rgba(0,0,0,0.35),
        0 2px 8px rgba(0,0,0,0.2)
      `,
      ...style,
    }}>
      {/* Top specular sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
        pointerEvents: "none", zIndex: 2,
        background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)",
        borderRadius: "20px 20px 0 0",
      }} />
      {/* Bottom refraction tint */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        pointerEvents: "none", zIndex: 2,
        background: `linear-gradient(0deg, ${accentColor} 0%, transparent 100%)`,
        borderRadius: "0 0 20px 20px",
      }} />
      {children}
    </div>
  );
}


export default function App() {
  const [darkMode, setDarkMode] = useState(true);
const currentYear = new Date().getFullYear();

const Logo  = darkMode ?   LightLogo:DarkLogo;
  const canvasRef = useRef();
  useScene(canvasRef,darkMode);
  const C = darkMode ? themes.dark : themes.light;

  useEffect(() => {

    const saved = localStorage.getItem("theme");

    if (saved) {
      setDarkMode(saved === "dark");
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);


  const { scrollY } = useScroll();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollValue, setScrollValue] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const totalTime = 500;


    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, totalTime / 100);


    const finishTimer = setTimeout(() => setLoaded(true), totalTime);


    const onScroll = () => setScrollValue(window.scrollY);
    window.addEventListener("scroll", onScroll);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // FIX 3: all useTransform calls at top level (Rules of Hooks)
  // Navbar Animations
  const navWidth = useTransform(
    scrollY,
    [0, 150],
    ["90%", "50%"]
  );

  const navTop = useTransform(
    scrollY,
    [0, 150],
    ["20px", "20px"]
  );

  const navRadius = useTransform(
    scrollY,
    [0, 150],
    ["999px", "999px"]
  );

  const navPadding = useTransform(
    scrollY,
    [0, 150],
    ["0 32px", "0 20px"]
  );

  const navHeight = useTransform(
    scrollY,
    [0, 150],
    [70, 60]
  );

  const navBackground = useTransform(
    scrollY,
    [0, 150],
    [
      "rgba(4,12,2,0.60)",
      "rgba(4,12,2,0.90)"
    ]
  );

  const navBorder = useTransform(
    scrollY,
    [0, 150],
    [
      "rgba(160,219,33,0.15)",
      "rgba(160,219,33,0.35)"
    ]
  );

  const navShadow = useTransform(
    scrollY,
    [0, 150],
    [
      "0 0 0 rgba(0,0,0,0)",
      "0 12px 35px rgba(0,0,0,.45)"
    ]
  );

  const scrollIndicatorOpacity = useTransform(
    scrollY,
    [0, 200],
    [1, 0]
  );

  const navScrolled = scrollValue > 40;

  const NavItems = [
    "Overview",
    "About",
    "Services",
    "Why Us?",
   
  ];

  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      fontFamily: "Futura Md BT",
      overflowX: "hidden",
    }}>

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />





      <motion.div
        className="mouse-glow"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", damping: 20, stiffness: 500, mass: 0.10 }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(160,219,33,0.3); }
          50%      { box-shadow: 0 0 40px rgba(160,219,33,0.6), 0 0 80px rgba(160,219,33,0.2); }
        }
        @keyframes loader-expand { from { width: 0; } to { width: 100%; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.scrollbar} }
        ::-webkit-scrollbar-thumb { background: #A0DB21; border-radius: 4px; }
        .nav-link {
          color: ${C.muted};
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { color: ${C.text}; }
        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(160,219,33,0.08);
          border: 1px solid rgba(160,219,33,0.25);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${C.emerald};
          margin-bottom: 24px;
        }
        .gradient-text {
          background: linear-gradient(91deg, ${C.emerald} 0%,${C.text} 41%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .grid-3 { grid-template-columns: 1fr; } }
        .hero-title {
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.04em;
          margin: 0 0 28px;
        }
        .stat-number {
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${C.emerald};
          font-variant-numeric: tabular-nums;
        }
        .mouse-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none; 
  z-index: 9999;
  
 
  transform: translate(-50%, -50%); 
  
  
  will-change: transform; 
  filter: blur(40px);
}
      `}</style>


      {/* Loading screen */}
      {!loaded && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: C.loadingscreen, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "16px", flexShrink: 0 }}>
            <img src={icon} alt="HINT" style={{ width: "100px", height: "auto" }} />
          </div>
          <div style={{ width: "200px", height: "1px", background: "rgba(7, 10, 1, 0.2)", overflow: "hidden", borderRadius: "2px" }}>
            <div style={{ height: "100%", background: C.emerald, width: `${progress}%` }} />
          </div>

          {/* <div style={{ fontSize: "12px", color: C.muted, letterSpacing: "0.1em" }}>
            INITIALIZING VERIFIABLE COMPUTE
          </div> */}
        </div>
      )}

      {/* WebGL Canvas  -- galaxy */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "100vw", height: "100vh",
          zIndex: 0, pointerEvents: "none",
          opacity: loaded ? 1 : 0, transition: "opacity 1s",
        }}
      />

      {/* Radial gradient overlay */}
      {/* <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(4,12,2,0.4) 100%)",
      }} /> */}

      {/* ── NAVBAR */}
      {/* FIX 5: removed x:"-50%" (not valid MotionValue shorthand in all versions).
                Use left+transform instead, or marginLeft auto trick */}
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

          // Premium Glass Effect
          background:
            "linear-gradient(90deg, transparent, transparent)",

          backdropFilter: "blur(1.5px) saturate(100%)",
          WebkitBackdropFilter: "blur(5px) saturate(100%)",
          //  transform:"rotate(25deg)",

          animation: "shine 6s linear infinite",
          border: "1px solid rgba(255,255,255,0.12)",

          boxShadow: `
      rgba(0, 0, 0, 0.1) 0px 0px 20px, rgba(255, 255, 255, 0.12) 0px 1px 0px inset, rgba(255, 255, 255, 0.03) 0px -1px 0px inset
  `,

          overflow: "hidden",

          maxWidth: "1300px",
        }}
      >

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexShrink: 0,
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "clamp(80px,10vw,110px)",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* Navigation */}
        <motion.div
          animate={{
            // opacity: navScrolled ? 0 : 1,
            // y: navScrolled ? -8 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px,2vw,30px)",
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {NavItems.map((item) => (
            <motion.span
              key={item}
              whileHover={{
                y: -2,
                color: C.text,
              }}
              transition={{
                duration: 0.2,
              }}
              style={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "clamp(13px,1vw,15px)",
              }}
            >
            <a href={`#${item.replaceAll(' ', '').toLowerCase()}`} className="hover:text-[#A0DB21] transition">

              {item}
              </a>
            </motion.span>
          ))}
        </motion.div>

        {/* Button */}
        <div
          style={{
            flexShrink: 0,
          }}
        >          <a href={`#contact`} className="hover:text-[#040C02] transition">

          <MagneticButton
            style={{
              background:
                "linear-gradient(135deg,#B3FF10 0%,#A0DB21 100%)",
              color: "#040C02",

              padding: "10px 22px",

              borderRadius: "999px",

              fontSize: "clamp(12px,1vw,14px)",

              fontWeight: 700,

              letterSpacing: ".02em",

              boxShadow:
                "0 0 20px rgba(160,219,33,.35)",

              whiteSpace: "nowrap",
            }}
          >
                        Contact Us

          
          </MagneticButton></a>
        </div>

      </motion.nav>


      {/* ══ SECTION 1 — HERO ══ */}
      <section id='overview' style={{
        position: "relative", zIndex: 2,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "140px clamp(20px,6vw,80px) 80px",
      }}>
        {/* <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px",
          background: "rgba(160,219,33,0.06)",
          border: "1px solid rgba(160,219,33,0.2)",
          borderRadius: "100px",
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: C.emerald,
          marginBottom: "40px",
          animation: loaded ? "fade-up 0.8s 0.4s both" : "none",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: C.emerald, animation: "glow-pulse 2s infinite",
          }} />
          Now in Public Beta
        </div> */}

        <h1 className="hero-title" style={{ animation: loaded ? "fade-up 0.9s 0.55s both" : "none" }}>
          <span className="gradient-text">Let's Build</span>{" "}
          {/* <span style={{ color: C.text }}>to</span> */}
          <br />
          <GlitchText text="Something Great" style={{ color: C.text }} />
        </h1>

        <p style={{
          fontSize: "clamp(16px,2.5vw,22px)",
          color: '#fff', fontWeight: 400,
          lineHeight: 1.6, maxWidth: "720px",
          marginBottom: "48px",
          animation: loaded ? "fade-up 0.9s 0.7s both" : "none",
          fontFamily:"Consolas, Monaco, 'Courier New', monospace"
        }}>
          <Typewriter strings={[
           "your next big idea starts here.",
"human intelligence. powered by technology.",
"we build digital products that make businesses smarter.",
           ]} />
        </p>

        <div style={{
          display: "flex", gap: "16px", flexWrap: "wrap",
          justifyContent: "flex-start",
          alignSelf: "flex-start",
          animation: loaded ? "fade-up 0.9s 0.85s both" : "none",
          marginTop: "115px"
        }}>
          <MagneticButton style={{
            background: "linear-gradient(135deg, #B3FF10 0%, #A0DB21 100%)",
            color: "#040C02",
            padding: "15px 36px",
            borderRadius: "100px",
            fontSize: "15px", fontWeight:100,
            letterSpacing: "0.01em",
            boxShadow: "0 0 40px rgba(179,255,16,0.4), 0 0 80px rgba(160,219,33,0.15)",
          }}>
            Start your projects →
          </MagneticButton>
          <MagneticButton style={{
            background: "linear-gradient(90deg,    transparent,    rgba(255, 255, 255, 0.8),    transparent  );",
            backdropFilter: "blur(20px)",
            color: C.text,
            padding: "15px 36px",
            borderRadius: "100px",
            fontSize: "15px", fontWeight: 100,
            border: "1px solid rgba(248,250,252,0.15)",
            backdropFilter: "blur(8px)",
          }}>
          <a href="https://www.behance.net/ppahp" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: '#A0DB21' }}>
            View Our works
          </a>
          </MagneticButton>
        </div>

        {/* FIX 7: scroll indicator — MotionValue used correctly via style prop */}
        <motion.div style={{
          position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "8px",
          opacity: scrollIndicatorOpacity,
        }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: C.muted }}>SCROLL</span>
          <div style={{
            width: "1px", height: "40px",
            background: `linear-gradient(${C.emerald}, transparent)`,
            animation: "float 1.5s ease-in-out infinite",
          }} />
        </motion.div>
      </section>

      {/* ══ SECTION 2 — STATS ══ */}
      {/* <section style={{
        position: "relative", zIndex: 2,
        padding: "80px clamp(20px,6vw,80px)",
        maxWidth: "1200px", margin: "0 auto",
      }}>
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(160,219,33,0.3), transparent)",
          marginBottom: "80px",
        }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px", textAlign: "center",
        }}>
           {[
            { val: 99, suffix: ".99%", label: "Uptime SLA" },
            { val: 14, suffix: "ms", label: "Avg proof latency" },
            { val: 2, suffix: "B+", label: "Inferences verified" },
            { val: 500, suffix: "+", label: "Enterprise customers" },
          ].map((s, i) => <StatItem key={i} {...s} index={i} />)}
        </div>
      </section> */}


     

      {/* ══ SECTION 3 — TECHNOLOGY ══ */}
      <section id='about'  style={{
        position: "relative", zIndex: 2,
        padding: "80px clamp(20px,6vw,80px)",
        maxWidth: "1200px", margin: "40px auto",
        background: "rgb(98 98 98 / 9%)",
        backdropFilter: "blur(2px) saturate(100%)",
        WebkitBackdropFilter: "blur(0px) saturate(180%)",
        borderRadius: "32px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div  style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "80px", alignItems: "center",
        }}>
          <div >
            <div className="section-eyebrow">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.emerald }} />
              Who We Are
            </div>
            <h2 style={{
              fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 24px",
            }}>
              <span className="gradient-text">Your Technology</span><br />Partner for the<br />Digital Future

            </h2>
            <p style={{ color: C.muted, fontSize: "16px", lineHeight: 1.75, margin: "0 0 32px" }}>
              Whether you're launching a startup, modernizing your business, or scaling an enterprise, we provide comprehensive solutions tailored to your goals.

            </p>
            {/* <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "ZK-proof per inference in under 14ms",
                "Hardware attestation via TEE enclaves",
                "Immutable audit log — SOC 2 & EU AI Act ready",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "transparent",
                              backdropFilter: "blur(1.5px) saturate(100%)",

                    border: "1px solid rgba(160,219,33,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "2px",
                    fontSize: "10px", color: C.emerald,
                  }}>✓</div>
                  <span style={{ color: C.text, fontSize: "15px", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div> */}


          </div>

          {/* Liquid glass 3D panel */}
          <GlassPanel height="420px">
            <MiniCanvas3D type="verify" />
            <div style={{
              position: "absolute", inset: 0,
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,219,33,0.015) 2px, rgba(160,219,33,0.015) 4px)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "absolute", top: "16px", left: "16px", fontSize: "10px", fontFamily: "monospace", color: "rgba(160,219,33,0.6)", letterSpacing: "0.08em" }}>
              ZK-PROOF ENGINE v2.4.1
            </div>
            <div style={{ position: "absolute", bottom: "16px", right: "16px", fontSize: "10px", fontFamily: "monospace", color: "rgba(160,219,33,0.4)", letterSpacing: "0.08em" }}>
              ◉ LIVE
            </div>
          </GlassPanel>
        </div>
      </section>
 <Marquee/>
      {/* ══ SECTION 4 — FEATURES GRID ══ */}
      <section id='services' style={{
        position: "relative", zIndex: 2,
        padding: "80px clamp(20px,6vw,80px)",
        maxWidth: "1200px", margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-eyebrow" style={{ margin: "0 auto 24px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.emerald }} />
            Our Expertise
          </div>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0 }}>
Complete Digital Solutions.  
<br />
            <span className="gradient-text">One Trusted Partner.</span>
          </h2>
        </div>
        <div className="grid-3" >
        <FeatureCard
  darkMode={darkMode}
  icon="🎨"
  title="Design & Branding"
  body="Crafting intuitive digital experiences and memorable brand identities."
  delay={0}
/>

<FeatureCard
  darkMode={darkMode}
  icon="💻"
  title="Web Development"
  body="Building fast, responsive, and scalable websites for modern businesses."
  delay={0.1}
/>

<FeatureCard
  darkMode={darkMode}
  icon="⚙️"
  title="Software Development"
  body="Developing custom software solutions tailored to your business needs."
  delay={0.2}
/>

<FeatureCard
  darkMode={darkMode}
  icon="📱"
  title="Mobile App Development"
  body="Creating high-performance Android and iOS applications."
  delay={0.3}
/>

<FeatureCard
  darkMode={darkMode}
  icon="☁️"
  title="Cloud & DevOps"
  body="Optimizing infrastructure with cloud solutions and automation."
  delay={0.4}
/>

<FeatureCard
  darkMode={darkMode}
  icon="📢"
  title="Digital Marketing"
  body="Growing your brand through strategic digital marketing campaigns."
  delay={0.5}
/>

<FeatureCard
  darkMode={darkMode}
  icon="🔒"
  title="Digital Security"
  body="Protecting digital assets with anti-piracy and security solutions."
  delay={0.6}
/>

<FeatureCard
  darkMode={darkMode}
  icon="💡"
  title="IT Consulting"
  body="Providing expert technology guidance and digital transformation strategies."
  delay={0.7}
/>

<FeatureCard
  darkMode={darkMode}
  icon="🛠️"
  title="Maintenance & Support"
  body="Ensuring your digital products remain secure, updated, and reliable."
  delay={0.8}
/> </div>
      </section>

      {/* ══ SECTION 5 — COMPUTE + AGENT ══ */}
      <section id='whyus?' style={{
        position: "relative", zIndex: 2,
        padding: "80px clamp(20px,6vw,80px)",
        maxWidth: "1200px", margin: "0 auto",
      }}>
        {/* Verifiable Compute */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", marginBottom: "120px" }}>
          <GlassPanel height="400px" accentColor="rgba(14,165,233,0.04)">
            <MiniCanvas3D type="compute" />
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(14,165,233,0.012) 2px, rgba(14,165,233,0.012) 4px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "16px", left: "16px", fontSize: "10px", fontFamily: "monospace", color: "#A0DB21", letterSpacing: "0.08em" }}>
              VERIFIABLE COMPUTE LAYER 
            </div>
          </GlassPanel>
          <div>
            <div className="section-eyebrow">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A0DB21" }} />
              Why Hint
            </div>
            <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 24px" }}>
           Why Businesses <br/> Choose Us

             </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "Human-Centered Innovation",
                "End-to-End Expertise",
                "Scalable Solutions",
                "Quality Without Compromise",
                "Security-First Approach"
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: "transparent",
                              backdropFilter: "blur(1.5px) saturate(100%)",

                    border: "1px solid rgba(160,219,33,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "2px",
                    fontSize: "10px", color: C.emerald,
                  }}>✓</div>
                  <span style={{ color: C.text, fontSize: "15px", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agentic */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div className="section-eyebrow">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.emerald }} />
              Agentic AI Era
            </div>
            <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 24px" }}>
              Trust your agents.<br />Know what they did.
            </h2>
            <p style={{ color: C.muted, fontSize: "15px", lineHeight: 1.75 }}>
              As AI agents take autonomous actions — browsing, writing code, executing
              transactions — HINT provides the audit backbone. Every tool call,
              every reasoning step, cryptographically sealed.
            </p>
            <MagneticButton style={{
              marginTop: "28px", background: "transparent", color: C.emerald,
              padding: "12px 28px", borderRadius: "100px", fontSize: "14px", fontWeight: 600,
              border: `1px solid ${C.emerald}`, letterSpacing: "0.02em",
            }}>
              Explore Agentic Docs →
            </MagneticButton>
          </div>
          <GlassPanel height="400px">
            <MiniCanvas3D type="agent" />
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(160,219,33,0.012) 2px, rgba(160,219,33,0.012) 4px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "16px", left: "16px", fontSize: "10px", fontFamily: "monospace", color: "rgba(160,219,33,0.6)", letterSpacing: "0.08em" }}>
              AGENT NETWORK GRAPH
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ══ SECTION 6 — TESTIMONIALS ══ */}
      {/* <section style={{
        position: "relative", zIndex: 2,
        padding: "80px clamp(20px,6vw,80px)",
        maxWidth: "1200px", margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="section-eyebrow" style={{ margin: "0 auto 24px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.emerald }} />
            Our Process
          </div>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em" }}>
            Turning Ideas Into Digital Success
          </h2>
        </div>
        <div>
           FIX 9: same hook-in-map issue — use a sub-component 
          
<ProcessCarousel  processData={processData} />

        </div>
      </section> */}

      {/* ══ SECTION 7 — CTA ══ */}
      <section id="contact" style={{
        position: "relative", zIndex: 2,
        padding: "120px clamp(20px,6vw,80px) 160px",
        textAlign: "center",
        maxWidth: "900px", margin: "0 auto",
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: -1, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(160,219,33,0.07) 0%, transparent 70%)" }} />
        <div className="section-eyebrow" style={{ margin: "0 auto 32px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.emerald }} />
          Get Started Today
        </div>
        <h2 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 24px" }}>
          <span className="gradient-text">Ready to Build
</span><br /> Something Exceptional!
        </h2>
        {/* <p style={{ color: C.muted, fontSize: "18px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 48px" }}>
          Join 500+ enterprises that already ship AI products with cryptographic auditability built in.
        </p> */}
        {/* <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <MagneticButton style={{
            background: "linear-gradient(135deg, #B3FF10 0%, #A0DB21 100%)",
            color: "#040C02", padding: "18px 44px", borderRadius: "100px",
            fontSize: "16px", fontWeight: 700,
            boxShadow: "0 0 60px rgba(160,219,33,0.4), 0 0 120px rgba(160,219,33,0.15)",
          }}>
            Request Early Access
          </MagneticButton>
          <MagneticButton style={{
            background: "transparent", color: C.text,
            padding: "18px 44px", borderRadius: "100px",
            fontSize: "16px", fontWeight: 600,
            border: `1px solid ${C.border}`,
          }}>
            View Documentation
          </MagneticButton>
        </div> */}

<ContactForm/>



      </section>

      {/* ── FOOTER */}
      <footer style={{
        position: "relative", zIndex: 2,
        borderTop: "1px solid rgba(160,219,33,0.1)",
        padding: "40px clamp(20px,6vw,80px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", marginLeft: "16px", flexShrink: 0 }}>
          <img src={Logo} alt="HINT" style={{ width: "100px", height: "auto" }} />
        </div>
        <div style={{ fontSize: "12px", color: C.muted }}>
          © {currentYear} <span style={{ color: C.emerald }}>H</span>int Technologies. <span style={{ color: C.emerald }}>Human</span> Intelligence. Powered by Technology.

        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Design", "Develop", "Secure", "Grow"].map(l => (
            <span key={l} className="nav-link" style={{ fontSize: "12px" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS (fix hook-in-map violations)
   ═══════════════════════════════════════════ */
function StatItem({ val, suffix, label, index }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(24px)",
      transition: `all 0.7s ${index * 120}ms cubic-bezier(0.23,1,0.32,1)`,
    }}>
      <div className="stat-number">
        {vis ? <Counter target={val} suffix={suffix} /> : `0${suffix}`}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "8px", letterSpacing: "0.04em" }}>
        {label}
      </div>
    </div>
  );
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
          background: "linear-gradient(135deg, rgba(160,219,33,0.3), rgba(14,165,233,0.2))",
          border: `1px solid rgba(160,219,33,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700, color: "#A0DB21",
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