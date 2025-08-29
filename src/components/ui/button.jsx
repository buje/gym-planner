import React from "react";
import { motion } from "framer-motion";

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700",
  ghost: "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
  link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
  gradient: "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-lg",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  
  const variantClasses = buttonVariants[variant] || buttonVariants.default;
  const sizeClasses = sizeVariants[size] || sizeVariants.default;
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
}
