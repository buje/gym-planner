import React from "react";
import { motion } from "framer-motion";

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  className = "",
  ...props 
}) {
  return (
    <motion.div
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      whileHover={{ y: -2 }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-600 dark:text-gray-300">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-blue-100 dark:bg-blue-900/20 p-3 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        )}
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center space-x-2">
          <motion.div
            className={`flex items-center space-x-1 text-xs ${
              trend === "up" ? "text-green-600" : 
              trend === "down" ? "text-red-600" : 
              "text-gray-600 dark:text-gray-400"
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {trend === "up" ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : trend === "down" ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            <span>{trendValue}</span>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function StatsGrid({ children, className = "", ...props }) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
