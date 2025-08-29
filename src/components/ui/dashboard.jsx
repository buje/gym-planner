import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatsCard, StatsGrid } from "./stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Badge } from "./badge";
import { 
  BarChart3,
  LineChart,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Zap,
  CheckCircle,
  Circle,
  Weight,
  Repeat,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Composant pour afficher l'évolution du poids moyen par exercice
export function ExerciseProgressCharts({ runs }) {
  const [exerciseCharts, setExerciseCharts] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!runs || runs.length === 0) return;

    // Filtrer les séances terminées et les trier par date
    const finishedRuns = runs
      .filter(r => r.finishedAt)
      .sort((a, b) => a.finishedAt - b.finishedAt);

    if (finishedRuns.length === 0) {
      setExerciseCharts({});
      setStats({});
      return;
    }

    // Collecter tous les exercices et leurs données par session
    const exerciseData = {};

    finishedRuns.forEach(run => {
      const runDate = new Date(run.finishedAt);
      const dateLabel = formatDateFrench(run.finishedAt);
      
      run.sections?.forEach(section => {
        section.items?.forEach(item => {
          if (!exerciseData[item.title]) {
            exerciseData[item.title] = [];
          }

          // Calculer le poids moyen pour cet exercice dans cette séance
          if (item.done && item.weights && item.weights.length > 0) {
            const completedWeights = item.weights.filter((w, index) => item.done[index]);
            if (completedWeights.length > 0) {
              const avgWeight = Math.round(completedWeights.reduce((sum, w) => sum + w, 0) / completedWeights.length);
              exerciseData[item.title].push({
                session: dateLabel,
                weight: avgWeight,
                sets: completedWeights.length,
                date: runDate.getTime()
              });
            }
          }
        });
      });
    });

    // Trier les données par date pour chaque exercice
    Object.keys(exerciseData).forEach(exerciseName => {
      exerciseData[exerciseName].sort((a, b) => a.date - b.date);
    });

    // Filtrer les exercices avec au moins 2 sessions
    const filteredExercises = Object.entries(exerciseData)
      .filter(([_, data]) => data.length >= 2)
      .sort(([_, a], [__, b]) => b.length - a.length)
      .slice(0, 4); // Top 4 exercices pour la grille 2x2

    setExerciseCharts(Object.fromEntries(filteredExercises));

    // Calculer les statistiques globales
    const allWeights = Object.values(exerciseData)
      .flat()
      .map(d => d.weight);
    
    if (allWeights.length > 0) {
      setStats({
        totalExercises: filteredExercises.length,
        totalSessions: finishedRuns.length,
        averageWeight: Math.round(allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length)
      });
    }
  }, [runs]);

  // Fonction pour formater la date en français
  const formatDateFrench = (timestamp) => {
    const date = new Date(timestamp);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${dayName} ${day}/${month}`;
  };

  if (!exerciseCharts || Object.keys(exerciseCharts).length === 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progression par exercice
          </CardTitle>
          <CardDescription>
            Aucune donnée de progression disponible. Terminez quelques séances avec des poids cochés pour voir vos progrès.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Progression par exercice
        </CardTitle>
        <CardDescription>
          Évolution du poids moyen par exercice et par session
        </CardDescription>
      </CardHeader>
      
      <div className="space-y-6">
        {/* Statistiques globales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalExercises}</div>
            <div className="text-sm text-muted-foreground">Exercices suivis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Sessions totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.averageWeight}kg</div>
            <div className="text-sm text-muted-foreground">Poids moyen</div>
          </div>
        </div>

        {/* Graphiques par exercice en grille responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {Object.entries(exerciseCharts).map(([exerciseName, data], exerciseIndex) => {
            const weights = data.map(d => d.weight);
            const firstWeight = weights[0];
            const lastWeight = weights[weights.length - 1];
            const progress = lastWeight - firstWeight;
            const maxWeight = Math.max(...weights);

            // Préparer les données pour recharts
            const chartData = data.map((session, index) => ({
              name: session.session,
              weight: session.weight,
              sets: session.sets
            }));

            return (
              <Card key={exerciseName} className="p-3 md:p-4">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="font-medium text-base md:text-lg">{exerciseName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        {firstWeight}kg → {lastWeight}kg
                      </span>
                      <Badge 
                        variant={progress > 0 ? "success" : progress < 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {progress > 0 ? "+" : ""}{progress}kg
                      </Badge>
                    </div>
                  </div>

                  {/* Graphique en barres avec recharts */}
                  <div className="w-full h-72 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={chartData} 
                        margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                        barSize={25}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11, fill: '#9CA3AF' }}
                          interval={0}
                          angle={0}
                          textAnchor="middle"
                          height={50}
                        />
                        <YAxis 
                          domain={[0, Math.round(maxWeight * 1.1)]}
                          tick={{ fontSize: 11, fill: '#9CA3AF' }}
                          tickFormatter={(value) => Math.round(value)}
                          width={45}
                        />
                        <Tooltip 
                          formatter={(value, name) => [`${value}kg`, 'Poids moyen']}
                          labelFormatter={(label) => label.replace(/\n/g, ' - ')}
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            color: '#F9FAFB'
                          }}
                        />
                        <Bar 
                          dataKey="weight" 
                          fill="#3B82F6" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function Dashboard({ stats, recentWorkouts, topExercises, className = "" }) {
  const {
    totalWorkouts = 0,
    thisWeek = 0,
    totalExercises = 0,
    averageWeight = 0,
    streak = 0,
    totalTime = 0
  } = stats || {};

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques principales */}
      <StatsGrid>
        <StatsCard
          title="Total séances"
          value={totalWorkouts}
          subtitle="Toutes les séances"
          icon={<Calendar className="h-6 w-6" />}
          trend="up"
          trendValue="+12% ce mois"
        />
        
        <StatsCard
          title="Cette semaine"
          value={thisWeek}
          subtitle="Séances cette semaine"
          icon={<Activity className="h-6 w-6" />}
          trend="up"
          trendValue="+2 vs semaine dernière"
        />
        
        <StatsCard
          title="Exercices"
          value={totalExercises}
          subtitle="Exercices différents"
          icon={<Target className="h-6 w-6" />}
        />
        
        <StatsCard
          title="Poids moyen"
          value={`${averageWeight}kg`}
          subtitle="Poids moyen par exercice"
          icon={<Zap className="h-6 w-6" />}
          trend="up"
          trendValue="+5kg ce mois"
        />
      </StatsGrid>

      {/* Séries et objectifs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Série actuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-gray-900 dark:text-white">Série actuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-primary mb-2">{streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                jours consécutifs
              </div>
              <div className="mt-4">
                <Badge variant="success" className="text-xs">
                  🔥 En feu !
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temps total */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary" />
              <span className="text-gray-900 dark:text-white">Temps total</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-secondary mb-2">
                {Math.floor(totalTime / 60)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {totalTime % 60} minutes
              </div>
              <div className="mt-4">
                <Badge variant="info" className="text-xs">
                  ⏱️ Temps d'entraînement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Statistique utile : Fréquence d'entraînement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-gray-900 dark:text-white">Fréquence d'entraînement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.totalWorkouts > 0 ? Math.round((stats.totalWorkouts / Math.max(1, Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 7)))) * 10) / 10 : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  séances par semaine
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.thisWeek}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Cette semaine</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.streak}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Jours consécutifs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Séances récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-gray-900 dark:text-white">Séances récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {recentWorkouts?.slice(0, 6).map((workout, index) => (
                <motion.div
                  key={workout.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{workout.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(workout.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">{workout.exercises} ex.</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function QuickStats({ stats, className = "" }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {Object.entries(stats || {}).map(([key, value]) => (
        <motion.div
          key={key}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-100 dark:border-gray-700"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
