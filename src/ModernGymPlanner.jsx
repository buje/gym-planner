import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, PageHeader, PageContent } from "./components/layout";
import { 
  Navigation, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  StatsCard,
  StatsGrid,
  Dashboard,
  ExerciseProgressCharts,
  ExerciseCard,
  ProgramForm,
  ConfirmModal,
  ThemeProvider
} from "./components/ui";
import { 
  Plus, 
  Play, 
  Edit3, 
  Trash2, 
  History, 
  Dumbbell, 
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Zap,
  CheckCircle,
  Circle,
  Weight,
  Repeat
} from "lucide-react";

// Types (JSDoc)
/** @typedef {{ id:string, title:string, notes?:string, sections: Section[] }} Program */
/** @typedef {{ id:string, title:string, items: Item[] }} Section */
/** @typedef {{ id:string, title:string, reps:number, weight:number }} Item */
/** @typedef {{ id:string, programId:string, startedAt:number, finishedAt?:number, title:string, sections: RunSection[] }} RunInstance */

// Storage helpers
const LS_KEYS = {
  PROGRAMS: "gym_programs_v2",
  RUNS: "gym_runs_v2",
};

// Anciennes clés pour la migration
const OLD_LS_KEYS = {
  PROGRAMS: "gym_programs_v1",
  RUNS: "gym_runs_v1",
};

const hasLS = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Fonction de migration des données
function migrateData() {
  if (!hasLS()) return;
  
  try {
    // Migration des programmes
    const oldPrograms = localStorage.getItem(OLD_LS_KEYS.PROGRAMS);
    if (oldPrograms && !localStorage.getItem(LS_KEYS.PROGRAMS)) {
      console.log("Migration des programmes depuis v1...");
      localStorage.setItem(LS_KEYS.PROGRAMS, oldPrograms);
    }
    
    // Migration des runs
    const oldRuns = localStorage.getItem(OLD_LS_KEYS.RUNS);
    if (oldRuns && !localStorage.getItem(LS_KEYS.RUNS)) {
      console.log("Migration des runs depuis v1...");
      localStorage.setItem(LS_KEYS.RUNS, oldRuns);
    }
  } catch (error) {
    console.error("Erreur lors de la migration:", error);
  }
}

function loadPrograms() {
  if (!hasLS()) return [];
  try { 
    const data = localStorage.getItem(LS_KEYS.PROGRAMS);
    console.log("Loading programs:", data);
    return JSON.parse(data || "[]"); 
  } catch (error) { 
    console.error("Error loading programs:", error);
    return []; 
  }
}

function savePrograms(programs) {
  if (!hasLS()) return; 
  try {
    localStorage.setItem(LS_KEYS.PROGRAMS, JSON.stringify(programs));
    console.log("Saved programs:", programs);
  } catch (error) {
    console.error("Error saving programs:", error);
  }
}

function loadRuns() {
  if (!hasLS()) return [];
  try { 
    const data = localStorage.getItem(LS_KEYS.RUNS);
    console.log("Loading runs:", data);
    return JSON.parse(data || "[]"); 
  } catch (error) { 
    console.error("Error loading runs:", error);
    return []; 
  }
}

function saveRuns(runs) {
  if (!hasLS()) return; 
  try {
    localStorage.setItem(LS_KEYS.RUNS, JSON.stringify(runs));
    console.log("Saved runs:", runs);
  } catch (error) {
    console.error("Error saving runs:", error);
  }
}

// Utility functions
function formatDateFrench(timestamp) {
  const date = new Date(timestamp);
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `Le ${dayName} ${day}/${month} à ${hours}h${minutes}`;
}

function formatDateShort(timestamp) {
  const date = new Date(timestamp);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${dayName} ${day}/${month}`;
}

function toRunInstance(program) {
  return {
    id: uid(),
    programId: program.id,
    startedAt: Date.now(),
    title: program.title,
    sections: program.sections.map(s => ({
      id: s.id,
      title: s.title,
      items: s.items.map(i => ({
        id: i.id,
        title: i.title,
        reps: i.reps,
        weights: Array(i.reps).fill(i.weight),
        done: Array(i.reps).fill(false),
        notes: "",
        currentWeight: i.weight
      }))
    }))
  };
}

function calculateStats(programs, runs) {
  const totalWorkouts = runs.filter(r => r.finishedAt).length;
  const thisWeek = runs.filter(r => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return r.finishedAt && r.finishedAt > weekAgo;
  }).length;
  
  const totalExercises = new Set(
    runs.flatMap(r => r.sections.flatMap(s => s.items.map(i => i.title)))
  ).size;
  
  const averageWeight = runs
    .filter(r => r.finishedAt)
    .flatMap(r => r.sections.flatMap(s => s.items))
    .filter(i => i.weights && i.weights.length > 0)
    .reduce((sum, i) => sum + i.weights.reduce((a, b) => a + b, 0) / i.weights.length, 0) / 
    runs.filter(r => r.finishedAt).flatMap(r => r.sections.flatMap(s => s.items)).length || 0;
  
  const streak = calculateStreak(runs);
  const totalTime = runs
    .filter(r => r.finishedAt)
    .reduce((total, r) => total + (r.finishedAt - r.startedAt) / (1000 * 60), 0);
  
  return {
    totalWorkouts,
    thisWeek,
    totalExercises,
    averageWeight: Math.round(averageWeight * 10) / 10,
    streak,
    totalTime: Math.round(totalTime)
  };
}

function calculateStreak(runs) {
  const finishedRuns = runs
    .filter(r => r.finishedAt)
    .sort((a, b) => b.finishedAt - a.finishedAt);
  
  if (finishedRuns.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const hasWorkout = finishedRuns.some(r => {
      const workoutDate = new Date(r.finishedAt);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === currentDate.getTime();
    });
    
    if (hasWorkout) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export default function ModernGymPlanner() {
  const [programs, setPrograms] = useState([]);
  const [runs, setRuns] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProgram, setEditingProgram] = useState(null);
  const [runningId, setRunningId] = useState(null);

  // États pour les modales de confirmation
  const [showFinishRunModal, setShowFinishRunModal] = useState(false);
  const [showDeleteRunModal, setShowDeleteRunModal] = useState(false);
  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0); // Force le re-render
  const [themeKey, setThemeKey] = useState(0); // Clé unique pour forcer le re-render du thème

  // Écouter les changements de thème pour forcer le re-render
  useEffect(() => {
    const handleThemeChange = () => {
      console.log("Changement de thème détecté, re-render forcé");
      // Forcer un re-render en modifiant légèrement l'état
      setActiveTab(prev => prev);
    };

    const handleForceThemeUpdate = (event) => {
      console.log("Force theme update détecté, re-render complet forcé");
      const { theme, isDark } = event.detail;
      console.log("Nouveau thème:", theme, "isDark:", isDark);
      
      // Forcer un re-render complet en modifiant plusieurs états
      setActiveTab(prev => prev);
      setForceUpdate(prev => prev + 1);
      setThemeKey(prev => prev + 1); // Changer la clé pour forcer le re-render
      console.log("Clé du thème mise à jour:", themeKey + 1);
    };

    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('forceThemeUpdate', handleForceThemeUpdate);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('forceThemeUpdate', handleForceThemeUpdate);
    };
  }, []);

  useEffect(() => {
    migrateData(); // Appel de la fonction de migration au chargement
    setPrograms(loadPrograms());
    setRuns(loadRuns());
  }, []);

  const stats = useMemo(() => calculateStats(programs, runs), [programs, runs]);
  
  const activeRuns = useMemo(() => 
    runs.filter(r => !r.finishedAt), [runs]
  );
  
  const finishedRuns = useMemo(() => 
    runs.filter(r => r.finishedAt).sort((a, b) => b.finishedAt - a.finishedAt), [runs]
  );

  const handleSaveProgram = (program) => {
    const all = loadPrograms();
    const exists = all.find(p => p.id === program.id);
    let next;
    if (exists) {
      next = all.map(p => (p.id === program.id ? program : p));
    } else {
      next = [...all, program];
    }
    savePrograms(next);
    setPrograms(next);
    setEditingProgram(null);
    setActiveTab("programs");
  };

  const handleDeleteProgram = (programId) => {
    const next = programs.filter(p => p.id !== programId);
    savePrograms(next);
    setPrograms(next);
  };

  const handleStartRun = (program) => {
    const run = toRunInstance(program);
    const next = [...runs, run];
    saveRuns(next);
    setRuns(next);
    setRunningId(run.id);
    setActiveTab("run");
  };

  const handleDeleteRun = (runId) => {
    const next = runs.filter(r => r.id !== runId);
    saveRuns(next);
    setRuns(next);
    if (runningId === runId) {
      setRunningId(null);
      setActiveTab("programs");
    }
  };

  const handleFinishRun = (runId) => {
    const next = runs.map(r => 
      r.id === runId ? { ...r, finishedAt: Date.now() } : r
    );
    saveRuns(next);
    setRuns(next);
    setRunningId(null);
    setActiveTab("programs");
  };

  const handleCreateProgram = () => {
    setEditingProgram({}); // Programme vide pour la création
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program); // Programme existant pour l'édition
  };

  const handleCancelProgram = () => {
    setEditingProgram(null);
  };

  // Gestionnaires pour les modales de confirmation
  const openFinishRunModal = (runId) => {
    setItemToDelete({ type: 'run', id: runId, action: 'finish' });
    setShowFinishRunModal(true);
  };

  const openDeleteRunModal = (runId) => {
    setItemToDelete({ type: 'run', id: runId, action: 'delete' });
    setShowDeleteRunModal(true);
  };

  const openDeleteProgramModal = (programId) => {
    setItemToDelete({ type: 'program', id: programId, action: 'delete' });
    setShowDeleteProgramModal(true);
  };

  const closeModals = () => {
    setShowFinishRunModal(false);
    setShowDeleteRunModal(false);
    setShowDeleteProgramModal(false);
    setItemToDelete(null);
  };

  const tabs = [
    { value: "dashboard", label: "Tableau de bord", icon: <Target className="h-4 w-4" /> },
    { value: "programs", label: "Programmes", icon: <Dumbbell className="h-4 w-4" /> },
    { value: "history", label: "Historique", icon: <History className="h-4 w-4" /> }
  ];

  return (
    <ThemeProvider>
      <Layout key={`theme-${themeKey}`}>
        <PageContent>
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
            showStats={true}
            stats={stats}
            className="mb-8"
          />

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <TabsContent value="dashboard" isActive={true}>
                <Dashboard 
                  stats={stats}
                  recentWorkouts={finishedRuns.slice(0, 5).map(r => ({
                    id: r.id,
                    name: r.title,
                    date: r.finishedAt,
                    exercises: r.sections.reduce((total, s) => total + s.items.length, 0)
                  }))}
                  topExercises={[]}
                />
              </TabsContent>
            )}

            {activeTab === "programs" && (
              <TabsContent value="programs" isActive={true}>
                <div className="space-y-6">
                  {/* En-tête des programmes */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Programmes d'entraînement
                    </h2>
                    <Button onClick={() => setEditingProgram({})}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau programme
                    </Button>
                  </div>

                  {/* Formulaire d'édition */}
                  {editingProgram !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {editingProgram.id ? "Modifier le programme" : "Créer un programme"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ProgramForm
                            program={editingProgram}
                            onSave={handleSaveProgram}
                            onCancel={handleCancelProgram}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Liste des programmes */}
                  {programs.length === 0 ? (
                    <Card className="text-center py-12">
                      <Dumbbell className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucun programme
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Crée ton premier programme d'entraînement pour commencer !
                      </p>
                      <Button onClick={() => setEditingProgram({})}>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un programme
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {programs.map(program => (
                        <Card key={program.id} className="hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                  {program.title}
                                </h3>
                                {program.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{program.notes}</p>
                                )}
                                <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                  {program.sections.length} section(s)
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => setEditingProgram(program)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => openDeleteProgramModal(program.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {program.sections.map(section => (
                                <div key={section.id} className="text-sm text-gray-600 dark:text-gray-300">
                                  <strong>{section.title}:</strong> {section.items.length} exercices
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button 
                                className="w-full" 
                                onClick={() => handleStartRun(program)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Démarrer une séance
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Séances en cours */}
                  {activeRuns.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Séances en cours
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeRuns.map(run => (
                          <Card key={run.id} className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-blue-900 dark:text-blue-100">
                                    {run.title}
                                  </div>
                                  <div className="text-xs text-blue-600 dark:text-blue-300">
                                    démarrée {formatDateFrench(run.startedAt)}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      setRunningId(run.id);
                                      setActiveTab("run");
                                    }}
                                  >
                                    Reprendre
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteRun(run.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {activeTab === "history" && (
              <TabsContent value="history" isActive={true}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Historique des séances
                  </h2>
                  
                  {/* Graphiques d'évolution des poids par exercice */}
                  {finishedRuns.length > 0 && (
                    <ExerciseProgressCharts runs={runs} />
                  )}
                  
                  {finishedRuns.length === 0 ? (
                    <Card className="text-center py-12">
                      <History className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucun historique
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Terminez au moins une séance pour voir votre historique
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {finishedRuns.map(run => (
                        <Card key={run.id} className="hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {run.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {formatDateFrench(run.finishedAt)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {run.sections.reduce((total, s) => total + s.items.length, 0)} exercices
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => {
                                    setRunningId(run.id);
                                    setActiveTab("run");
                                  }}
                                >
                                  Revoir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => openDeleteRunModal(run.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {activeTab === "run" && runningId && (
              <TabsContent value="run" isActive={true}>
                <div className="space-y-6">
                  {(() => {
                    const currentRun = runs.find(r => r.id === runningId);
                    if (!currentRun) return null;
                    
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="ghost" 
                            onClick={() => setActiveTab("programs")}
                            className="text-gray-900 dark:text-white"
                          >
                            ← Retour aux programmes
                          </Button>
                          <div className="flex gap-2">
                            {!currentRun.finishedAt && (
                              <Button onClick={() => openFinishRunModal(runningId)}>
                                Terminer la séance
                              </Button>
                            )}
                            <Button 
                              variant="destructive"
                              onClick={() => openDeleteRunModal(runningId)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                        
                        {/* Interface de suivi de la séance */}
                        <div className="space-y-6">
                          {/* En-tête de la séance */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Play className="h-5 w-5 text-primary" />
                                <span>{currentRun.title}</span>
                                <Badge 
                                  variant={currentRun.finishedAt ? "success" : "outline"} 
                                  className="ml-auto"
                                >
                                  {currentRun.finishedAt ? "Terminée" : "En cours"}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                Séance démarrée {formatDateFrench(currentRun.startedAt)}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Sections et exercices */}
                          {currentRun.sections.map((section, sectionIndex) => (
                          <Card key={section.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {section.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {section.items.map((item, itemIndex) => {
                                  const completedSets = item.done.filter(Boolean).length;
                                  const totalSets = item.reps;
                                  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
                                  
                                  return (
                                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                      {/* En-tête de l'exercice */}
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                          {item.title}
                                        </h4>
                                        <Badge 
                                          variant={progress === 100 ? "success" : progress > 50 ? "warning" : "info"}
                                        >
                                          {completedSets}/{totalSets} séries
                                        </Badge>
                                      </div>
                                      
                                      {/* Barre de progression */}
                                      <div className="mb-3">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                          <motion.div
                                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Séries */}
                                      <div className="space-y-2">
                                        {Array.from({ length: item.reps }, (_, setIndex) => {
                                          const isDone = item.done[setIndex] || false;
                                          const weight = item.weights[setIndex] || item.currentWeight || 0;
                                          
                                          return (
                                            <div
                                              key={setIndex}
                                              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                                isDone 
                                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                                              }`}
                                            >
                                              <div className="flex items-center space-x-3">
                                                <button
                                                  onClick={() => {
                                                    const updatedRuns = runs.map(r => {
                                                      if (r.id === runningId) {
                                                        return {
                                                          ...r,
                                                          sections: r.sections.map(s => {
                                                            if (s.id === section.id) {
                                                              return {
                                                                ...s,
                                                                items: s.items.map(i => {
                                                                  if (i.id === item.id) {
                                                                    const newDone = [...i.done];
                                                                    newDone[setIndex] = !newDone[setIndex];
                                                                    return { ...i, done: newDone };
                                                                  }
                                                                  return i;
                                                                })
                                                              };
                                                            }
                                                            return s;
                                                          })
                                                        };
                                                      }
                                                      return r;
                                                    });
                                                    setRuns(updatedRuns);
                                                    saveRuns(updatedRuns);
                                                  }}
                                                  className="text-2xl transition-colors duration-200"
                                                >
                                                  {isDone ? (
                                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                                  ) : (
                                                    <Circle className="h-6 w-6 text-gray-400 dark:text-gray-300 hover:text-primary" />
                                                  )}
                                                </button>
                                                
                                                <div className="flex items-center space-x-2">
                                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Série {setIndex + 1}
                                                  </span>
                                                  {isDone && (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                  )}
                                                </div>
                                              </div>
                                              
                                              <div className="flex items-center space-x-2">
                                                <input
                                                  type="number"
                                                  value={weight}
                                                  onChange={(e) => {
                                                    const newWeight = parseFloat(e.target.value) || 0;
                                                    const updatedRuns = runs.map(r => {
                                                      if (r.id === runningId) {
                                                        return {
                                                          ...r,
                                                          sections: r.sections.map(s => {
                                                            if (s.id === section.id) {
                                                              return {
                                                                ...s,
                                                                items: s.items.map(i => {
                                                                  if (i.id === item.id) {
                                                                    const newWeights = [...i.weights];
                                                                    newWeights[setIndex] = newWeight;
                                                                    return { ...i, weights: newWeights };
                                                                  }
                                                                  return i;
                                                                })
                                                              };
                                                            }
                                                            return s;
                                                          })
                                                        };
                                                      }
                                                      return r;
                                                    });
                                                    setRuns(updatedRuns);
                                                    saveRuns(updatedRuns);
                                                  }}
                                                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                  placeholder="kg"
                                                />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </TabsContent>
          )}
        </AnimatePresence>
        
        {/* Modales de confirmation */}
        <ConfirmModal
          isOpen={showFinishRunModal}
          onClose={closeModals}
          onConfirm={() => {
            if (itemToDelete?.type === 'run' && itemToDelete?.action === 'finish') {
              handleFinishRun(itemToDelete.id);
              closeModals();
            }
          }}
          title="Terminer la séance"
          message="Êtes-vous sûr de vouloir terminer cette séance ? Cette action ne peut pas être annulée."
          confirmText="Terminer"
          cancelText="Annuler"
          variant="success"
        />
        
        <ConfirmModal
          isOpen={showDeleteRunModal}
          onClose={closeModals}
          onConfirm={() => {
            if (itemToDelete?.type === 'run' && itemToDelete?.action === 'delete') {
              handleDeleteRun(itemToDelete.id);
              closeModals();
            }
          }}
          title="Supprimer la séance"
          message="Êtes-vous sûr de vouloir supprimer cette séance ? Cette action ne peut pas être annulée."
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
        />
        
        <ConfirmModal
          isOpen={showDeleteProgramModal}
          onClose={closeModals}
          onConfirm={() => {
            if (itemToDelete?.type === 'program' && itemToDelete?.action === 'delete') {
              handleDeleteProgram(itemToDelete.id);
              closeModals();
            }
          }}
          title="Supprimer le programme"
          message="Êtes-vous sûr de vouloir supprimer ce programme ? Cette action ne peut pas être annulée."
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
        />
      </PageContent>
    </Layout>
    </ThemeProvider>
  );
}
