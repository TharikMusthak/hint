import { useMemo } from "react";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: Math.random() * 20 + 4,
        left: Math.random() * 50 + 5,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 2,
      })),
    []
  );

  return (
    <>
      {/* Animations */}
      <style>{`
        @keyframes twinkle {
          0%,100% {
            opacity: .3;
            transform: scale(.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shoot {
          0% {
            transform: translateX(-30px) translateY(0) rotate(-30deg);
            opacity:0;
          }
          15%{
            opacity:1;
          }
          60% {
            transform: translateX(80px) translateY(20px) rotate(-30deg);
            opacity:0;
          }
          100%{
            opacity:0;
          }
        }

        @keyframes sunGlow{
          0%,100%{
            box-shadow:
              0 0 10px rgba(255,208,0,.5),
              0 0 18px rgba(255,208,0,.4);
          }
          50%{
            box-shadow:
              0 0 18px rgba(255,208,0,.8),
              0 0 28px rgba(255,208,0,.6);
          }
        }
      `}</style>

      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle Theme"
        className={`fixed top-10 right-5 z-[9999]
        w-[60px] h-[30px]
        rounded-full overflow-hidden
        border transition-all duration-500
        backdrop-blur-xl
        hover:scale-110 active:scale-95
        ${
          darkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border-slate-500"
            : "bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 border-sky-200"
        }
        shadow-[0_5px_18px_rgba(0,0,0,.35)]
      `}
      >
        {/* Gloss */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />

        {/* DAY */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            darkMode ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Clouds */}
          <div className="absolute bottom-0 left-1 w-6 h-3 bg-white rounded-full opacity-90"></div>
          <div className="absolute bottom-1 left-4 w-5 h-2.5 bg-white rounded-full opacity-90"></div>

          <div className="absolute bottom-0 right-1 w-5 h-2.5 bg-white rounded-full opacity-90"></div>

          {/* Light circles */}
          <div className="absolute -top-2 left-1 w-8 h-8 rounded-full bg-white/10"></div>
          <div className="absolute top-0 left-4 w-6 h-6 rounded-full bg-white/10"></div>
        </div>

        {/* NIGHT */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            darkMode ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Stars */}
          {stars.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                top: `${star.top}px`,
                left: `${star.left}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}

          {/* Shooting Star */}
          <div
            className="absolute top-2 left-2 w-5 h-[1px]
            bg-gradient-to-r from-white to-transparent
            rotate-[-30deg]"
            style={{
              animation: "shoot 5s linear infinite",
            }}
          />
        </div>

        {/* Toggle Knob */}
        <div
          className={`absolute top-[2px]
          w-[26px] h-[26px]
          rounded-full
          transition-all duration-500 ease-in-out
          flex items-center justify-center
          shadow-xl
          ${
            darkMode
              ? "translate-x-[32px] bg-slate-200"
              : "translate-x-[2px] bg-yellow-300"
          }`}
        >
          {darkMode ? (
            /* Moon */
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full bg-gray-100"></div>
              <div className="absolute -top-0.5 left-1 w-5 h-5 rounded-full bg-slate-300"></div>
            </div>
          ) : (
            /* Sun */
            <div
              className="w-5 h-5 rounded-full bg-yellow-300"
              style={{
                animation: "sunGlow 2.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </button>
    </>
  );
}