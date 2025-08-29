import React from "react";
import { motion } from "framer-motion";

const badgeVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
  success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
};

export function Badge({ 
  className = "", 
  variant = "default", 
  children, 
  interactive = false,
  ...props 
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  const interactiveClasses = interactive ? "cursor-pointer" : "";
  
  const classes = `${baseClasses} ${variantClasses} ${interactiveClasses} ${className}`;

  if (interactive) {
    return (
      <motion.span
        className={classes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
