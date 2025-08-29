import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export function Navigation({ 
  activeTab, 
  onTabChange, 
  tabs, 
  className = "",
  showStats = false,
  stats = {},
  ...props 
}) {
  // Fonction de traduction des clés de statistiques
  const translateStatKey = (key) => {
    const translations = {
      totalWorkouts: "Total séances",
      thisWeek: "Cette semaine",
      totalExercises: "Exercices",
      averageWeight: "Poids moyen",
      streak: "Série",
      totalTime: "Temps total"
    };
    return translations[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* En-tête avec titre et statistiques rapides */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Planificateur de Gym 💪
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Planifie, lance et suis tes progrès d'entraînement
          </p>
        </div>
        
        {showStats && (
          <div className="flex space-x-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {translateStatKey(key)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              isActive={activeTab === tab.value}
              onClick={() => onTabChange(tab.value)}
              className="flex items-center space-x-2"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </motion.div>
  );
}

export function Breadcrumb({ items, className = "", ...props }) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 ${className}`} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          <button
            onClick={item.onClick}
            className={`hover:text-gray-900 dark:hover:text-white transition-colors ${
              index === items.length - 1 ? "text-gray-900 dark:text-white font-medium" : ""
            }`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
