import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { CheckCircle, Circle, TrendingUp, Weight, Repeat } from "lucide-react";

export function ExerciseCard({ 
  exercise, 
  isActive = false,
  onToggleSet,
  onUpdateWeight,
  onUpdateNotes,
  className = "",
  ...props 
}) {
  const { title, reps, weights = [], done = [], notes, currentWeight } = exercise;
  
  const completedSets = done.filter(Boolean).length;
  const totalSets = reps;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* En-tête de l'exercice */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Repeat className="h-4 w-4" />
                    <span>{reps} séries</span>
                  </div>
                  {currentWeight && (
                    <div className="flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>{currentWeight}kg</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Badge de progression */}
              <Badge 
                variant={progress === 100 ? "success" : progress > 50 ? "warning" : "info"}
                className="text-xs"
              >
                {completedSets}/{totalSets}
              </Badge>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Séries */}
          <div className="p-4 space-y-3">
            {Array.from({ length: reps }, (_, index) => {
              const isDone = done[index] || false;
              const weight = weights[index] || currentWeight || 0;
              
              return (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    isDone 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggleSet(index)}
                      className="text-2xl transition-colors duration-200"
                    >
                      {isDone ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-primary" />
                      )}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Série {index + 1}
                      </span>
                      {isDone && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => onUpdateWeight(index, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700"
                      placeholder="kg"
                    />
                    <span className="text-sm text-gray-500">kg</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Notes */}
          {notes && (
            <div className="px-4 pb-4">
              <textarea
                value={notes}
                onChange={(e) => onUpdateNotes(e.target.value)}
                placeholder="Notes sur l'exercice..."
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-800"
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ExerciseList({ exercises, ...props }) {
  return (
    <div className="space-y-4" {...props}>
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id || index}
          exercise={exercise}
          {...props}
        />
      ))}
    </div>
  );
}
