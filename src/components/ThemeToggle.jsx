import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <>
      <style>{`
        .track {
          transition: all 0.25s ease;
        }

        .knob {
          transition: transform 0.25s ease, background 0.25s ease;
        }
      `}</style>

      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
        className={`
          fixed top-6 right-6 z-[9999]
          w-[75px] h-[37px]
          rounded-full
          flex items-center
          px-[4px]
          track
          shadow-md
          border
          ${
            darkMode
              ? "bg-transparent border-gray-700"
              : "bg-transparentborder-gray-300"
          }
        `}
      >
        {/* LEFT ICON (moon) */}
        <span className="absolute left-3 text-[10px]">
          <Moon size={20} />
        </span>

        {/* RIGHT ICON (sun) */}
        <span className="absolute right-3 text-[10px]">
          <Sun size={20} />
        </span>

        {/* KNOB */}
        <div
          className={`
            w-[28px] h-[28px]
            rounded-full
            shadow-sm
            knob
            flex items-center justify-center
            ${
              darkMode
                ? "translate-x-[36px] bg-gray-800"
                : "translate-x-0 bg-gray-300"
            }
          `}
        />
      </button>
    </>
  );
}