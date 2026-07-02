import React from 'react';
import { 
  SiReact, 
  SiNodedotjs, 
  SiFigma, 
  SiPython,
  SiTailwindcss, 
  SiThreedotjs, 
  SiJavascript,
  SiPhp,
  SiMysql,
  SiFirebase 
} from 'react-icons/si';

const STACKS = [
  { name: 'React', icon: <SiReact /> },
  { name: 'Node.js', icon: <SiNodedotjs /> },
  { name: 'Figma', icon: <SiFigma /> }, 
  { name: 'Python', icon: <SiPython /> },
   { name: 'Mysql', icon: <SiMysql /> },
  { name: 'Php', icon: <SiPhp /> },
  { name: 'Javascript', icon: <SiJavascript /> },
  { name: 'Tailwind', icon: <SiTailwindcss /> },
  { name: 'Three.js', icon: <SiThreedotjs /> },
  { name: 'Firebase', icon: <SiFirebase /> },
];
export default function Marquee({  }) {
  
  return (
    <div style={{ padding: '30px 0', overflow: 'hidden' }}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: fit-content;
          animation: scroll 25s linear infinite;
        }
      `}</style>
      <div className="marquee-inner">
        {[...STACKS, ...STACKS].map((tech, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '50px 50px', 
            fontSize: '2.4rem', 
            fontWeight: 600, 
            // color: T.textMuted, 
            opacity: 0.7 
          }}>
            <span style={{ fontSize: '2.6rem' }}>{tech.icon}</span>
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '1rem' }}>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}