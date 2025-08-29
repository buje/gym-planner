import React from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ui/theme-toggle";

export function Layout({ 
  children, 
  className = "",
  activeTab = "dashboard",
  onTabChange = () => {},
  onCloseSidebar = () => {}
}) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Contenu principal */}
      <div className="w-full">
        {/* Header mobile */}
        {/* 
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm lg:hidden">
          <div className="flex flex-1 items-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Planificateur de Gym
            </h1>
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <ThemeToggle />
          </div>
        </div>
        */}

        {/* Header principal pour écrans larges */}
        {/* 
        <div className="hidden lg:flex sticky top-0 z-40 h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 shadow-sm">
          <div className="flex flex-1 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Planificateur de Gym 💪
            </h1>
          </div>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
          </div>
        </div>
        */}

        {/* Contenu de la page */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children, className = "" }) {
  return (
    <motion.div
      className={`mb-8 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function PageContent({ children, className = "" }) {
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
