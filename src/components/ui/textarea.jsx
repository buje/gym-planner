import React, { forwardRef } from "react";
import { motion } from "framer-motion";

export const Textarea = forwardRef(({ 
  className = "", 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  const baseClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none";
  const errorClasses = error ? "border-destructive focus-visible:ring-destructive" : "";
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="relative">
      <motion.textarea
        className={classes}
        ref={ref}
        rows={rows}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      
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

Textarea.displayName = "Textarea";
