import React, { createContext, useContext, useState, useEffect } from "react";

// Créer un contexte pour le thème
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le thème
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Provider du thème
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [forceUpdate, setForceUpdate] = useState(0); // Force le re-render

  useEffect(() => {
    const savedTheme = localStorage.getItem("gym-planner-theme") || "light";
    console.log("ThemeProvider - Thème initial:", savedTheme);
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    console.log("=== APPLICATION DU THÈME ===");
    console.log("Thème à appliquer:", newTheme);
    
    // Nettoyer d'abord toutes les classes de thème
    document.documentElement.classList.remove("dark");
    
    // Appliquer le nouveau thème
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      console.log("Classe 'dark' AJOUTÉE");
    } else if (newTheme === "light") {
      // La classe 'dark' est déjà supprimée
      console.log("Classe 'dark' SUPPRIMÉE");
    } else if (newTheme === "system") {
      // Détecter la préférence système
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
        console.log("Classe 'dark' AJOUTÉE (système)");
      } else {
        // La classe 'dark' est déjà supprimée
        console.log("Classe 'dark' SUPPRIMÉE (système)");
      }
    }
    
    // Vérifier immédiatement après
    const isDark = document.documentElement.classList.contains('dark');
    console.log("Vérification immédiate - Classe 'dark' présente:", isDark);
    
    // Forcer un re-render de l'application
    setForceUpdate(prev => prev + 1);
    console.log("Force update déclenché:", forceUpdate + 1);
    
    // Émettre un événement personnalisé pour forcer tous les composants à se mettre à jour
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: newTheme, isDark } 
    }));
    console.log("Événement themeChange émis");
    
    // Forcer un re-render en modifiant légèrement le DOM
    setTimeout(() => {
      const html = document.documentElement;
      const currentClasses = html.className;
      html.className = currentClasses + ' ';
      html.className = currentClasses;
      console.log("DOM forcé à se mettre à jour");
      
      // Vérification finale
      const finalIsDark = html.classList.contains('dark');
      console.log("Vérification finale - Classe 'dark' présente:", finalIsDark);
    }, 50);
    
    console.log("=== FIN APPLICATION DU THÈME ===");
  };

  const toggleTheme = (newTheme) => {
    console.log("=== DÉBUT CHANGEMENT DE THÈME ===");
    console.log("Thème actuel:", theme);
    console.log("Nouveau thème:", newTheme);
    
    // Mettre à jour l'état React d'abord
    setTheme(newTheme);
    
    // Sauvegarder dans localStorage
    localStorage.setItem("gym-planner-theme", newTheme);
    
    // Appliquer le thème immédiatement
    applyTheme(newTheme);
    
    // Simuler le comportement du changement de thème système
    // en forçant un re-render après un délai
    setTimeout(() => {
      console.log("Simulation du changement de thème système...");
      // Forcer un re-render en modifiant l'état
      setForceUpdate(prev => prev + 1);
      
      // Émettre un événement pour forcer tous les composants à se mettre à jour
      window.dispatchEvent(new CustomEvent('forceThemeUpdate', { 
        detail: { theme: newTheme, isDark: document.documentElement.classList.contains('dark') } 
      }));
      
      // Forcer un re-render supplémentaire
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
        console.log("Force update supplémentaire après simulation");
      }, 100);
    }, 50);
    
    console.log("=== FIN CHANGEMENT DE THÈME ===");
  };

  const value = {
    theme,
    toggleTheme,
    isDark: document.documentElement.classList.contains('dark'),
    forceUpdate, // Exposer forceUpdate pour forcer les re-renders
    // Ajouter une fonction pour forcer la mise à jour de tous les composants
    refreshTheme: () => {
      const currentIsDark = document.documentElement.classList.contains('dark');
      console.log("Refresh forcé du thème, isDark:", currentIsDark);
      setForceUpdate(prev => prev + 1);
      // Émettre un événement pour forcer tous les composants à se mettre à jour
      window.dispatchEvent(new CustomEvent('forceThemeUpdate', { 
        detail: { theme, isDark: currentIsDark } 
      }));
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
