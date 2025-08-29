# 🏋️‍♂️ Gym Planner - Planificateur d'entraînement

Une application web moderne et intuitive pour planifier, lancer et suivre vos séances d'entraînement. Développée avec React, Tailwind CSS et Framer Motion.

## ✨ Fonctionnalités

- **📊 Tableau de bord** : Statistiques complètes de vos entraînements
- **📋 Programmes** : Création et gestion de programmes d'entraînement personnalisés
- **🏃‍♂️ Séances en cours** : Suivi en temps réel de vos séances actives
- **📈 Historique** : Graphiques d'évolution des poids et progression
- **🎯 Suivi des exercices** : Gestion des séries, répétitions et poids
- **💾 Sauvegarde locale** : Données persistantes dans le navigateur
- **📱 Interface responsive** : Optimisée pour mobile et desktop

## 🚀 Technologies utilisées

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Build** : Vite

## 🛠️ Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone <votre-repo>
cd gym-planner

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Lance le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code (si configuré)
```

## 📱 Utilisation

### Créer un programme
1. Aller dans l'onglet "Programmes"
2. Cliquer sur "Nouveau programme"
3. Remplir le formulaire avec vos exercices
4. Sauvegarder

### Démarrer une séance
1. Sélectionner un programme
2. Cliquer sur "Démarrer une séance"
3. Suivre les exercices et cocher les séries terminées
4. Terminer la séance

### Suivre vos progrès
- Consulter le tableau de bord pour les statistiques
- Voir l'historique pour l'évolution des poids
- Analyser les graphiques de progression

## 🚀 Déploiement sur Vercel

### Configuration automatique
1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement que c'est un projet Vite/React
3. Le déploiement se fera automatiquement

### Configuration manuelle
Si nécessaire, créez un fichier `vercel.json` à la racine :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Variables d'environnement
Aucune variable d'environnement n'est requise pour ce projet.

## 📁 Structure du projet

```
gym-planner/
├── src/
│   ├── components/          # Composants React
│   │   ├── ui/             # Composants UI réutilisables
│   │   └── layout.jsx      # Layout principal
│   ├── ModernGymPlanner.jsx # Composant principal
│   ├── main.jsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── public/                  # Assets statiques
├── index.html              # Template HTML
├── package.json            # Dépendances et scripts
├── tailwind.config.js      # Configuration Tailwind
├── vite.config.js          # Configuration Vite
└── README.md               # Ce fichier
```

## 🔧 Configuration

### Tailwind CSS
Le projet utilise Tailwind CSS avec une configuration personnalisée pour les couleurs et le thème sombre.

### Vite
Configuration optimisée pour le développement et la production avec HMR et build optimisé.

## 📊 Fonctionnalités techniques

- **Gestion d'état** : React Hooks (useState, useEffect, useMemo)
- **Persistance des données** : localStorage avec migration automatique
- **Responsive design** : Mobile-first avec breakpoints Tailwind
- **Animations** : Transitions fluides avec Framer Motion
- **Performance** : Lazy loading et optimisations React

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation des technologies utilisées

## 🎯 Roadmap

- [ ] Synchronisation cloud
- [ ] Application mobile (PWA)
- [ ] Partage de programmes
- [ ] Intégration avec des trackers de fitness
- [ ] Notifications et rappels

---

**Développé avec ❤️ pour la communauté fitness**
