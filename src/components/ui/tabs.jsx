import React from "react";
import { motion } from "framer-motion";

export function Tabs({ 
  value, 
  onValueChange, 
  className = "", 
  children, 
  ...props 
}) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ 
  className = "", 
  children, 
  ...props 
}) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-600 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className = "", 
  isActive = false,
  onClick,
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 dark:text-gray-300";
  const activeClasses = isActive 
    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
    : "hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white";
  
  const classes = `${baseClasses} ${activeClasses} ${className}`;

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function TabsContent({ 
  value, 
  children, 
  className = "", 
  isActive = false,
  ...props 
}) {
  if (!isActive) return null;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
