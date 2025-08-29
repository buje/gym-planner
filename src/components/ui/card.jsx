import React from "react";
import { motion } from "framer-motion";

export function Card({ 
  className = "", 
  children, 
  hover = true, 
  interactive = false,
  ...props 
}) {
  const baseClasses = "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-md hover:border-primary/20" : "";
  const interactiveClasses = interactive ? "cursor-pointer active:scale-[0.98]" : "";
  
  const classes = `${baseClasses} ${hoverClasses} ${interactiveClasses} ${className}`;

  if (interactive) {
    return (
      <motion.div
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
