import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Dumbbell,
  Target,
  Repeat
} from "lucide-react";

export function ProgramForm({ 
  program, 
  onSave, 
  onCancel, 
  className = "" 
}) {
  const [formData, setFormData] = useState(() => {
    // Initialisation sécurisée avec des valeurs par défaut
    const defaultProgram = {
      id: "",
      title: "",
      notes: "",
      sections: []
    };
    
    if (program && typeof program === 'object') {
      return {
        ...defaultProgram,
        ...program,
        sections: program.sections || []
      };
    }
    
    return defaultProgram;
  });

  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), { id: `section_${Date.now()}`, title: "Nouvelle section", items: [] }]
    }));
  };

  const removeSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).filter(s => s.id !== sectionId)
    }));
  };

  const addItem = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => 
        s.id === sectionId 
          ? { ...s, items: [...(s.items || []), { id: `item_${Date.now()}`, title: "Nouvel exercice", reps: 3, weight: 0 }] }
          : s
      )
    }));
  };

  const removeItem = (sectionId, itemId) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => 
        s.id === sectionId 
          ? { ...s, items: (s.items || []).filter(i => i.id !== itemId) }
          : s
      )
    }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSectionField = (sectionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => 
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    }));
  };

  const updateItemField = (sectionId, itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => 
        s.id === sectionId 
          ? {
              ...s,
              items: (s.items || []).map(i => 
                i.id === itemId ? { ...i, [field]: value } : i
              )
            }
          : s
      )
    }));
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave({
        ...formData,
        id: formData.id || `program_${Date.now()}`
      });
    }
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* En-tête du formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Informations du programme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du programme
            </label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ex: Push Pull Legs"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optionnel)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Description du programme, objectifs..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sections d'entraînement
          </h3>
          <Button onClick={addSection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        </div>

        <AnimatePresence>
          {(formData.sections || []).map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Dumbbell className="h-5 w-5 text-secondary" />
                      <Input
                        value={section.title || ""}
                        onChange={(e) => updateSectionField(section.id, "title", e.target.value)}
                        className="w-64"
                        placeholder="Nom de la section"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => addItem(section.id)}
                        size="sm"
                        variant="secondary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Exercice
                      </Button>
                      <Button
                        onClick={() => removeSection(section.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {(section.items || []).map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <Input
                            value={item.title || ""}
                            onChange={(e) => updateItemField(section.id, item.id, "title", e.target.value)}
                            placeholder="Nom de l'exercice"
                            className="mb-2"
                          />
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Repeat className="h-4 w-4 text-gray-500" />
                              <Input
                                type="number"
                                value={item.reps || 0}
                                onChange={(e) => updateItemField(section.id, item.id, "reps", parseInt(e.target.value) || 0)}
                                className="w-20"
                                placeholder="Séries"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-gray-500" />
                              <Input
                                type="number"
                                value={item.weight || 0}
                                onChange={(e) => updateItemField(section.id, item.id, "weight", parseFloat(e.target.value) || 0)}
                                className="w-20"
                                placeholder="Poids"
                              />
                              <span className="text-sm text-gray-500">kg</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => removeItem(section.id, item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                    
                    {(!section.items || section.items.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Aucun exercice dans cette section</p>
                        <p className="text-sm">Cliquez sur "Exercice" pour en ajouter un</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!formData.sections || formData.sections.length === 0) && (
          <Card className="text-center py-12">
            <Dumbbell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune section créée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre première section d'entraînement
            </p>
            <Button onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une section
            </Button>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {formData.sections.length} section(s) • 
            {formData.sections.reduce((total, s) => total + s.items.length, 0)} exercice(s)
          </div>
          <Button onClick={handleSave} disabled={!formData.title.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
