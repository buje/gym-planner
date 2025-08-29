import React, { forwardRef } from "react";
import { motion } from "framer-motion";

export const Input = forwardRef(({ 
  className = "", 
  type = "text", 
  error = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  const errorClasses = error ? "border-destructive focus-visible:ring-destructive" : "";
  const iconClasses = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";
  
  const classes = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className="relative">
      {icon && iconPosition === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <motion.input
        type={type}
        className={classes}
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      
      {icon && iconPosition === "right" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      
      {error && (
        <motion.div
          className="absolute -bottom-5 left-0 text-xs text-destructive"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = "Input";
