import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Plus, Trash2, Play, Save, History, Dumbbell, CheckSquare, List, ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --------------------
// Types (JSDoc only)
// --------------------
/** Program template (re-usable blueprint) */
/** @typedef {{ id:string, title:string, notes?:string, sections: Section[] }} Program */
/** @typedef {{ id:string, title:string, items: Item[] }} Section */
/** @typedef {{ id:string, title:string, reps:number, weight:number }} Item */

/** Program run (session) linked to a template but snapshotting its content */
/** @typedef {{ id:string, programId:string, startedAt:number, finishedAt?:number, title:string, sections: RunSection[] }} RunInstance */
/** @typedef {{ id:string, title:string, items: RunItem[] }} RunSection */
/** @typedef {{ id:string, title:string, reps:number, weights:number[], done:boolean[], notes?:string, currentWeight?:number }} RunItem */

// --------------------
// Storage helpers
// --------------------
const LS_KEYS = {
  PROGRAMS: "gym_programs_v1",
  RUNS: "gym_runs_v1",
};

const hasLS = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function loadPrograms() {
  if (!hasLS()) return [];
  try { return JSON.parse(localStorage.getItem(LS_KEYS.PROGRAMS) || "[]"); } catch { return []; }
}
function savePrograms(programs) {
  if (!hasLS()) return; localStorage.setItem(LS_KEYS.PROGRAMS, JSON.stringify(programs));
}
function _loadRunsRaw() {
  if (!hasLS()) return [];
  try { return JSON.parse(localStorage.getItem(LS_KEYS.RUNS) || "[]"); } catch { return []; }
}
function loadRuns() {
  return migrateRuns(_loadRunsRaw());
}
function saveRuns(runs) {
  if (!hasLS()) return; localStorage.setItem(LS_KEYS.RUNS, JSON.stringify(runs));
}

// --------------------
// Migration & safety utilities
// --------------------
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/** Ensure arrays exist and match reps; seed from currentWeight if needed. */
function ensureItemArrays(item) {
  let reps = isNum(item.reps) && item.reps > 0 ? item.reps : (Array.isArray(item.done) ? Math.max(1, item.done.length) : 1);
  let weights = Array.isArray(item.weights) ? item.weights.slice(0, reps) : [];
  const seed = isNum(item.currentWeight) ? item.currentWeight : (weights.length ? weights[0] : 0);
  while (weights.length < reps) weights.push(seed);

  let done = Array.isArray(item.done) ? item.done.slice(0, reps) : [];
  while (done.length < reps) done.push(false);

  return { ...item, reps, weights, done };
}

function migrateRun(run) {
  if (!run || !Array.isArray(run.sections)) return run;
  return {
    ...run,
    sections: run.sections.map(s => ({
      ...s,
      items: Array.isArray(s.items) ? s.items.map(ensureItemArrays) : [],
    }))
  };
}

function migrateRuns(runsArr) {
  if (!Array.isArray(runsArr)) return [];
  return runsArr.map(migrateRun);
}

// --------------------
// UI Utilities
// --------------------
const SectionCard = ({ children, title, right }) => (
  <Card className="mb-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between px-4 pt-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {right}
    </div>
    <CardContent className="pt-3">{children}</CardContent>
  </Card>
);

const Label = ({ children }) => (
  <div className="text-xs text-gray-500 uppercase tracking-wide">{children}</div>
);

// Fonction utilitaire pour formater les dates en français
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

// Fonction utilitaire pour le format court des dates (historique)
function formatDateShort(timestamp) {
  const date = new Date(timestamp);
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${dayName} ${day}/${month}`;
}

// --------------------
// Program Builder
// --------------------
function ProgramBuilder({ onSaved, initial }) {
  const [program, setProgram] = useState(
    initial || { id: uid(), title: "", notes: "", sections: [] }
  );

  function addSection() {
    setProgram(p => ({
      ...p,
      sections: [...p.sections, { id: uid(), title: "Haut du corps", items: [] }],
    }));
  }
  function removeSection(id) {
    setProgram(p => ({ ...p, sections: p.sections.filter(s => s.id !== id) }));
  }
  function addItem(sectionId) {
    setProgram(p => ({
      ...p,
      sections: p.sections.map(s => s.id === sectionId ? {
        ...s,
        items: [...s.items, { id: uid(), title: "Développé couché", reps: 10, weight: 40 }],
      } : s)
    }));
  }
  function removeItem(sectionId, itemId) {
    setProgram(p => ({
      ...p,
      sections: p.sections.map(s => s.id === sectionId ? {
        ...s,
        items: s.items.filter(i => i.id !== itemId)
      } : s)
    }));
  }

  function updateProgramField(key, value) {
    setProgram(p => ({ ...p, [key]: value }));
  }
  function updateSectionField(id, key, value) {
    setProgram(p => ({
      ...p,
      sections: p.sections.map(s => s.id === id ? { ...s, [key]: value } : s)
    }));
  }
  function updateItemField(sectionId, itemId, key, value) {
    setProgram(p => ({
      ...p,
      sections: p.sections.map(s => s.id === sectionId ? {
        ...s,
        items: s.items.map(i => i.id === itemId ? { ...i, [key]: value } : i)
      } : s)
    }));
  }

  function handleSave() {
    const all = loadPrograms();
    const exists = all.find(p => p.id === program.id);
    let next;
    if (exists) {
      next = all.map(p => (p.id === program.id ? program : p));
    } else {
      next = [...all, program];
    }
    savePrograms(next);
    onSaved?.(program);
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Infos du programme"
        right={<Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Enregistrer</Button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Titre</Label>
            <Input value={program.title} onChange={e=>updateProgramField("title", e.target.value)} placeholder="PPL – Push/Pull/Legs"/>
          </div>
          <div className="md:col-span-2">
            <Label>Notes</Label>
            <Textarea value={program.notes} onChange={e=>updateProgramField("notes", e.target.value)} placeholder="Objectif prise de force, 3 séances/sem"/>
          </div>
        </div>
      </SectionCard>

      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2"><List className="w-5 h-5"/>Sections</h3>
        <Button variant="secondary" onClick={addSection}><Plus className="w-4 h-4 mr-2"/>Ajouter une section</Button>
      </div>

      {program.sections.map((s, si) => (
        <SectionCard key={s.id} title={`Section ${si+1} – ${s.title}`}
          right={<Button variant="destructive" onClick={()=>removeSection(s.id)}><Trash2 className="w-4 h-4"/></Button>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <Label>Titre de la section (partie du corps)</Label>
              <Input value={s.title} onChange={e=>updateSectionField(s.id, "title", e.target.value)} placeholder="Pectoraux"/>
            </div>
          </div>

          <div className="space-y-3">
            {s.items.map((it, ii) => (
              <div key={it.id} className="border rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Exercice {ii+1}</h4>
                  <Button size="sm" variant="ghost" onClick={()=>removeItem(s.id, it.id)}><Trash2 className="w-4 h-4"/></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-3">
                    <Label>Titre</Label>
                    <Input value={it.title} onChange={e=>updateItemField(s.id, it.id, "title", e.target.value)} placeholder="Développé couché"/>
                  </div>
                  <div>
                    <Label>Répétitions</Label>
                    <Input type="number" min={1} value={it.reps} onChange={e=>updateItemField(s.id, it.id, "reps", Math.max(1, Number(e.target.value||1)))} />
                  </div>
                  <div>
                    <Label>Poids (kg)</Label>
                    <Input type="number" step="0.5" value={it.weight} onChange={e=>updateItemField(s.id, it.id, "weight", Number(e.target.value||0))}/>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="secondary" onClick={()=>addItem(s.id)}><Plus className="w-4 h-4 mr-2"/>Ajouter un exercice</Button>
          </div>
        </SectionCard>
      ))}

      <div className="flex gap-3">
        <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Enregistrer le programme</Button>
      </div>
    </div>
  );
}

// --------------------
// Run Session
// --------------------
function toRunInstance(program /** @type {Program} */) {
  return {
    id: uid(),
    programId: program.id,
    startedAt: Date.now(),
    title: program.title,
    sections: program.sections.map(s => ({
      id: uid(),
      title: s.title,
      items: s.items.map(it => ({
        id: uid(),
        title: it.title,
        reps: it.reps,
        weights: Array(it.reps).fill(it.weight), // per-set editable weights, prefilled from template
        done: Array(it.reps).fill(false),
      }))
    }))
  };
}

function RunView({ runId, onBack, runs, setRuns, onDelete }) {
  const run = runs.find(r => r.id === runId);

  function patchItem(sectionId, itemId, patcher) {
    setRuns(all => all.map(r => r.id !== runId ? r : {
      ...r,
      sections: r.sections.map(s => s.id !== sectionId ? s : {
        ...s,
        items: s.items.map(it => {
          if (it.id !== itemId) return it;
          const fixed = ensureItemArrays(it);
          return patcher(fixed);
        })
      })
    }));
  }

  function toggleRep(sectionId, itemId, repIndex) {
    patchItem(sectionId, itemId, (it) => ({
      ...it,
      done: it.done.map((d, idx) => idx === repIndex ? !d : d),
    }));
  }
  function updateSetWeight(sectionId, itemId, repIndex, value) {
    patchItem(sectionId, itemId, (it) => ({
      ...it,
      weights: it.weights.map((w, idx) => idx === repIndex ? value : w),
    }));
  }
  function markFinished() {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Terminer la séance ? Les progrès seront enregistrés dans l'historique.");
      if (!ok) return;
    }
    setRuns(all => all.map(r => r.id !== runId ? r : ({ ...r, finishedAt: Date.now() })));
    if (onBack) onBack();
  }

  if (!run) return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2"/>Retour</Button>
      <p>Cette séance n'existe plus.</p>
    </div>
  );

  const safeRun = migrateRun(run); // ensure arrays & reps are valid for rendering
  const totalSets = safeRun.sections.reduce((acc, s) => acc + s.items.reduce((a, it) => a + it.reps, 0), 0);
  const doneSets = safeRun.sections.reduce((acc, s) => acc + s.items.reduce((a, it) => a + it.done.filter(Boolean).length, 0), 0);
  const progress = totalSets ? Math.round((doneSets/totalSets)*100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2"/>Retour</Button>
        <div className="text-right">
          <div className="text-xl font-semibold flex items-center gap-2 justify-end"><Dumbbell className="w-5 h-5"/>{safeRun.title}</div>
          <div className="text-xs text-gray-500">Démarrée {formatDateFrench(safeRun.startedAt)}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progression</span>
          <span>{doneSets}/{totalSets} séries • {progress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {safeRun.sections.map((s) => (
        <SectionCard key={s.id} title={s.title}>
          <div className="space-y-6">
            {s.items.map((it) => (
              <div key={it.id} className="rounded-2xl border p-3">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="font-medium">{it.title}</div>
                </div>
                <div className="grid gap-2">
                  {Array.from({ length: it.reps }).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                      <div className="text-sm">Série {idx+1}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label>Kg</Label>
                          <Input
                            type="number"
                            step="0.5"
                            className="w-24"
                            value={isNum(it.weights?.[idx]) ? it.weights[idx] : (isNum(it.currentWeight) ? it.currentWeight : 0)}
                            onChange={e=>updateSetWeight(s.id, it.id, idx, Number(e.target.value||0))}
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input type="checkbox" className="scale-110" checked={!!it.done?.[idx]}
                            onChange={()=>toggleRep(s.id, it.id, idx)} />
                          <span className="flex items-center gap-1"><CheckSquare className="w-4 h-4"/>Fait</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}

      <div className="flex gap-3">
        <Button onClick={markFinished}><History className="w-4 h-4 mr-2"/>Clore la séance</Button>
        <Button variant="destructive" onClick={() => onDelete?.(runId)}><Trash2 className="w-4 h-4 mr-2"/>Supprimer la séance</Button>
      </div>
    </div>
  );
}

// --------------------
// History / Analytics
// --------------------
function avgDoneWeight(it){
  const hasArrays = Array.isArray(it.weights) && Array.isArray(it.done);
  if (!hasArrays) return null;
  let sum = 0, n = 0;
  for (let i=0;i<it.reps;i++) {
    const w = it.weights?.[i];
    const d = it.done?.[i];
    if (typeof w === 'number' && Number.isFinite(w) && d) { sum += w; n++; }
  }
  if (n === 0) return null;
  return sum / n;
}

function HistoryView({ runs, onDelete }) {
  // Use a different identifier to avoid any accidental redeclaration with parent state
  const runsData = loadRuns(); // already migrated
  const dataByItem = useMemo(() => {
    /** Build a map itemTitle => [{date, weightAvg}] across finished runs */
    const map = new Map();
    runsData
      .filter(r => r.finishedAt)
      .forEach(r => r.sections.forEach(s => s.items.forEach(it => {
        const key = (it.title || "").trim();
        if (!key) return;
        const avg = avgDoneWeight(it);
        if (avg == null) return; // ignore sessions with no completed sets for this exercise
        const entry = { date: formatDateShort(r.finishedAt), weight: avg };
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(entry);
      })));
    return map;
  }, [runsData]);

  // Build chart-ready structures with numeric timestamps using AVG of completed sets
  const charts = Array.from(dataByItem.entries()).map(([title]) => {
    const series = runsData
      .filter(r => r.finishedAt)
      .map(r => ({
        finishedAt: r.finishedAt,
        date: new Date(r.finishedAt),
        items: r.sections.flatMap(s => s.items
          .filter(it => (it.title || "").trim() === title)
          .map(it => ({ weight: avgDoneWeight(it) })))
      }))
      .map(e => ({ ...e, items: e.items.filter(x => x.weight != null) }))
      .filter(e => e.items.length > 0)
      .map(e => ({ dateLabel: formatDateShort(e.finishedAt), ts: e.finishedAt, weight: e.items[0].weight }))
      .sort((a,b)=>a.ts-b.ts);
    return { title, series };
  });

  if (charts.length === 0) {
    return <p className="text-sm text-gray-600">Aucun historique pour le moment. Terminez au moins une séance (avec au moins une série cochée) pour voir la progression.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Graphiques de progression */}
      {charts.map(({ title, series }) => (
        <SectionCard key={title} title={`Progression – ${title} (moyenne par séance)`}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      ))}

      {/* Liste des séances terminées avec possibilité de suppression */}
      <SectionCard title="Séances terminées">
        <div className="space-y-3">
          {runsData
            .filter(r => r.finishedAt)
            .sort((a, b) => b.finishedAt - a.finishedAt)
            .map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateFrench(r.finishedAt)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {r.sections.length} section(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => window.open(`#run-${r.id}`, '_blank')}>
                    Revoir
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(r.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          {runsData.filter(r => r.finishedAt).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune séance terminée pour le moment.
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

// --------------------
// Main App
// --------------------
export default function GymPlannerApp() {
  const [tab, setTab] = useState("programs");
  const [programs, setPrograms] = useState(loadPrograms());
  const [runs, setRuns] = useState(loadRuns());
  const [editingProgram, setEditingProgram] = useState(null);
  const [runningId, setRunningId] = useState(null);

  useEffect(()=>{ savePrograms(programs); }, [programs]);
  useEffect(()=>{ saveRuns(runs); }, [runs]);

  function createNewProgram() {
    setEditingProgram({ id: uid(), title: "", notes: "", sections: [] });
    setTab("builder");
  }

  function editProgram(p) {
    setEditingProgram(p);
    setTab("builder");
  }

  function deleteProgram(id) {
    const next = programs.filter(p => p.id !== id);
    setPrograms(next);
  }

  function deleteRun(id) {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.");
      if (!ok) return;
    }
    const next = runs.filter(r => r.id !== id);
    setRuns(next);
    
    // Si on supprime la séance en cours, retourner à la liste des programmes
    if (runningId === id) {
      setRunningId(null);
      setTab("programs");
    }
  }

  function handleSaved(program) {
    // merge into state
    setPrograms(prev => {
      const exists = prev.find(p => p.id === program.id);
      if (exists) return prev.map(p => p.id === program.id ? program : p);
      return [...prev, program];
    });
    setTab("programs");
  }

  function startRun(p) {
    const run = toRunInstance(p);
    const next = [run, ...runs];
    setRuns(next);
    setRunningId(run.id);
    setTab("run");
  }

  const finishedRuns = runs.filter(r => r.finishedAt);
  const activeRuns = runs.filter(r => !r.finishedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-md"><Dumbbell className="w-5 h-5"/></div>
            <div>
              <h1 className="text-2xl font-bold">Gym Planner</h1>
              <p className="text-xs text-gray-500">Crée, lance et suis tes progrès 💪</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={tab==="programs"?"default":"secondary"} onClick={()=>setTab("programs")}>Programmes</Button>
            <Button variant={tab==="history"?"default":"secondary"} onClick={()=>setTab("history")}><History className="w-4 h-4 mr-1"/>Historique</Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {tab === "programs" && (
            <motion.div key="programs" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Mes programmes</h2>
                <Button onClick={createNewProgram}><Plus className="w-4 h-4 mr-2"/>Nouveau programme</Button>
              </div>

              {programs.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-600">Aucun programme. Crée ton premier plan d'entraînement !</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {programs.map(p => (
                    <Card key={p.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{p.title || "Sans titre"}</h3>
                          {p.notes && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.notes}</p>}
                          <div className="text-xs text-gray-500 mt-2">{p.sections.length} section(s)</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={()=>editProgram(p)}>Éditer</Button>
                          <Button size="sm" onClick={()=>startRun(p)}><Play className="w-4 h-4 mr-1"/>Lancer</Button>
                          <Button size="sm" variant="destructive" onClick={()=>deleteProgram(p.id)}><Trash2 className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeRuns.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-base font-semibold mb-2">Séances en cours</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {activeRuns.map(r => (
                      <Card key={r.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-xs text-gray-500">démarrée {formatDateFrench(r.startedAt)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={()=>{ setRunningId(r.id); setTab("run"); }}>Reprendre</Button>
                            <Button size="sm" variant="destructive" onClick={()=>deleteRun(r.id)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {finishedRuns.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-base font-semibold mb-2">Dernières séances terminées</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {finishedRuns.slice(0,6).map(r => (
                      <Card key={r.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-xs text-gray-500">{formatDateFrench(r.finishedAt)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={()=>{ setRunningId(r.id); setTab("run"); }}>Revoir</Button>
                            <Button size="sm" variant="destructive" onClick={()=>deleteRun(r.id)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "builder" && (
            <motion.div key="builder" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}>
              <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" onClick={()=>setTab("programs")}><ArrowLeft className="w-4 h-4 mr-2"/>Retour</Button>
                <div className="text-sm text-gray-500">Astuce : tu peux créer des sections pour chaque partie du corps puis ajouter les exercices avec nb de répétitions et poids.</div>
              </div>
              <ProgramBuilder onSaved={handleSaved} initial={editingProgram} />
            </motion.div>
          )}

          {tab === "run" && runningId && (
            <motion.div key="run" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}>
              <RunView runId={runningId} onBack={()=>setTab("programs")} runs={runs} setRuns={setRuns} onDelete={deleteRun} />
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div key="history" initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}>
              <HistoryView runs={runs} onDelete={deleteRun} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-10 text-center text-xs text-gray-500">
          Données stockées localement (localStorage). Export/Import à venir.
        </footer>
      </div>
    </div>
  );
}

// --------------------
// DEV TESTS (simple runtime checks in console)
// --------------------
(function runDevTests(){
  if (typeof window === "undefined" || window.__GYM_TESTED__) return;
  window.__GYM_TESTED__ = true;

  // Test 1: toRunInstance weights & done lengths
  const sampleProgram = {
    id: "p1",
    title: "Test PPL",
    sections: [
      { id: "s1", title: "Pecs", items: [ { id:"i1", title:"DC", reps:3, weight:50 } ] }
    ]
  };
  const run = toRunInstance(sampleProgram);
  console.assert(run.sections[0].items[0].weights.length === 3, "weights array must match reps");
  console.assert(run.sections[0].items[0].weights.every(w => w === 50), "weights prefilled from template");
  console.assert(run.sections[0].items[0].done.filter(Boolean).length === 0, "no sets done initially");
  const totalSets = run.sections.reduce((acc, s) => acc + s.items.reduce((a, it) => a + it.reps, 0), 0);
  console.assert(totalSets === 3, "total sets should be 3");

  // Test 2: migrate old run (no weights, with currentWeight)
  const oldRun = {
    id: "r1", title: "Old", startedAt: Date.now(), finishedAt: Date.now(), sections: [
      { id: "s1", title: "Pecs", items: [ { id:"i1", title:"DC", reps:3, currentWeight: 42, done: [true, false, false] } ] }
    ]
  };
  const migrated = migrateRuns([oldRun]);
  const mi = migrated[0].sections[0].items[0];
  console.assert(mi.weights.length === 3 && mi.done.length === 3, "migrate: arrays sized to reps");
  console.assert(mi.weights[0] === 42 && mi.weights[1] === 42 && mi.weights[2] === 42, "migrate: seed weights from currentWeight");
  console.assert(mi.done[0] === true && mi.done[1] === false && mi.done[2] === false, "migrate: preserve done values and pad with false");

  // Test 3: avgDoneWeight calculation
  const itemForAvg = { title:"DC", reps:3, weights:[50, 52.5, 55], done:[true, true, false] };
  const avg = (function(){ let s=0,n=0; for(let i=0;i<3;i++){ if(itemForAvg.done[i]){s+=itemForAvg.weights[i];n++;}} return s/n; })();
  console.assert(Math.abs(avgDoneWeight(itemForAvg) - avg) < 1e-6, "avgDoneWeight should average only completed sets");

  // Test 4: avgDoneWeight with zero completed sets => null
  const itemZero = { title:"Row", reps:2, weights:[40,40], done:[false,false] };
  console.assert(avgDoneWeight(itemZero) === null, "avgDoneWeight returns null when nothing done");

  // Test 5: ensureItemArrays trims/pads to reps
  const weird = { title:"Squat", reps:2, weights:[100, 105, 110], done:[true], currentWeight: 95 };
  const fixed = ensureItemArrays(weird);
  console.assert(fixed.weights.length === 2 && fixed.done.length === 2, "ensureItemArrays sizes arrays to reps");
  console.assert(fixed.weights[0] === 100 && fixed.weights[1] === 105, "ensureItemArrays trims extra weights and keeps order");
  console.assert(fixed.done[0] === true && fixed.done[1] === false, "ensureItemArrays pads done with false");

  // Test 6: finishing a run should set finishedAt on the matching run
  const rr = [{ id: "x1", title: "Run", startedAt: 1, sections: [], finishedAt: undefined }];
  const closed = rr.map(r => r.id !== "x1" ? r : ({ ...r, finishedAt: 123 }));
  console.assert(closed[0].finishedAt === 123, "closing run should set finishedAt");

  // Test 7: avgDoneWeight ignores invalid values
  const itemWeird = { title:"DL", reps:3, weights:[100, NaN, 105], done:[true, true, true] };
  console.assert(Math.abs(avgDoneWeight(itemWeird) - (100+105)/2) < 1e-6, "avgDoneWeight should ignore NaN weights");

  // Test 8: formatDateFrench formatting
  const testDate = new Date('2024-08-12T15:45:00');
  const formatted = formatDateFrench(testDate.getTime());
  console.assert(formatted === "Le Lundi 12/08 à 15h45", `formatDateFrench should format correctly, got: ${formatted}`);

  // Test 9: formatDateShort formatting
  const testDateShort = new Date('2024-08-29T10:00:00');
  const formattedShort = formatDateShort(testDateShort.getTime());
  console.assert(formattedShort === "Jeudi 29/08", `formatDateShort should format correctly, got: ${formattedShort}`);
})();
