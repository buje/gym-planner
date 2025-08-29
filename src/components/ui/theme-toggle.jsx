import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-context";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme();
  
  console.log("ThemeToggle render - theme:", theme, "isDark:", isDark);

  const themes = [
    { value: "light", icon: Sun, label: "Clair" },
    { value: "dark", icon: Moon, label: "Sombre" },
    { value: "system", icon: Monitor, label: "Système" }
  ];

  return (
    <div className={`flex items-center space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
      {/* Indicateur de débogage */}
      <div className="text-xs text-red-500 dark:text-red-400 mr-2">
        {isDark ? "DARK" : "LIGHT"}
      </div>
      
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => {
            console.log("Clic sur bouton:", value);
            toggleTheme(value);
          }}
          className={`relative flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
            theme === value
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={label}
        >
          <Icon className="h-4 w-4" />
          {theme === value && (
            <motion.div
              className="absolute inset-0 rounded-md bg-blue-100 dark:bg-blue-900/20"
              layoutId="activeTheme"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
