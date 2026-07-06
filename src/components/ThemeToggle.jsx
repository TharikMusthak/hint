import { Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle theme"
      className="fixed top-6 mr-[100px] z-[9999] p-0 bg-transparent border-none outline-none cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Moon
              size={24}
              strokeWidth={2}
              className="text-white hover:scale-110 transition-transform"
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <Sun
              size={24}
              strokeWidth={2}
              className="text-black hover:scale-110 transition-transform"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}