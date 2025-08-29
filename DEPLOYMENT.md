# 🚀 Guide de déploiement Vercel

Ce guide vous accompagne pour déployer votre application Gym Planner sur Vercel.

## 📋 Prérequis

- Compte GitHub avec votre code source
- Compte Vercel (gratuit)
- Node.js 18+ installé localement

## 🔗 Connexion GitHub → Vercel

### 1. Créer un compte Vercel
- Allez sur [vercel.com](https://vercel.com)
- Connectez-vous avec votre compte GitHub
- Autorisez Vercel à accéder à vos repositories

### 2. Importer votre projet
- Cliquez sur "New Project"
- Sélectionnez votre repository `gym-planner`
- Vercel détectera automatiquement que c'est un projet Vite/React

### 3. Configuration automatique
Vercel configurera automatiquement :
- **Framework Preset** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

## ⚙️ Configuration personnalisée

### Variables d'environnement
Aucune variable d'environnement n'est requise pour ce projet.

### Configuration Vercel
Le fichier `vercel.json` est déjà configuré avec :
- Redirection SPA (Single Page Application)
- Cache optimisé pour les assets
- Headers de sécurité

## 🚀 Déploiement

### Premier déploiement
1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-3 minutes)
3. Votre app sera accessible via l'URL Vercel

### Déploiements automatiques
- Chaque push sur `main` déclenche un déploiement automatique
- Les pull requests créent des previews automatiques
- Vercel gère automatiquement les rollbacks en cas de problème

## 🔧 Personnalisation du domaine

### Domaine personnalisé
1. Allez dans "Settings" → "Domains"
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Vercel

### Sous-domaines
- `staging.votredomaine.com` pour les tests
- `www.votredomaine.com` pour la production

## 📊 Monitoring et analytics

### Vercel Analytics
- Activer dans "Settings" → "Analytics"
- Suivi des performances et erreurs
- Métriques de Core Web Vitals

### Logs et debugging
- Consultez les logs dans "Functions" → "Logs"
- Debug en temps réel avec "Functions" → "Debug"

## 🚨 Résolution de problèmes

### Build échoue
```bash
# Test local du build
npm run build

# Vérifier les erreurs
npm run lint
```

### Erreur 404 sur les routes
- Vérifiez que `vercel.json` contient les bonnes redirections
- Assurez-vous que le build génère bien le dossier `dist`

### Problèmes de performance
- Vérifiez la taille du bundle avec `npm run analyze`
- Optimisez les images et assets
- Utilisez la compression Vercel

## 🔄 Mise à jour

### Déploiement manuel
```bash
# Mettre à jour le code
git pull origin main

# Déployer via Vercel CLI
vercel --prod
```

### Vercel CLI (optionnel)
```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer
vercel --prod
```

## 📱 PWA et mobile

### Configuration PWA
- Ajoutez un `manifest.json` dans `public/`
- Configurez le service worker
- Testez sur mobile

### Performance mobile
- Vérifiez Lighthouse Score
- Optimisez les images
- Testez la vitesse de chargement

## 🔒 Sécurité

### Headers de sécurité
Le fichier `vercel.json` inclut déjà :
- Cache-Control pour les assets
- Redirection SPA sécurisée

### Variables sensibles
- Ne jamais commiter de clés API
- Utilisez les variables d'environnement Vercel
- Vérifiez les permissions GitHub

## 📈 Scaling

### Limites gratuites
- 100GB de bande passante/mois
- 100 fonctions serverless/mois
- Domaine `.vercel.app` gratuit

### Upgrade payant
- Bande passante illimitée
- Fonctions serverless illimitées
- Support prioritaire

## 🎯 Bonnes pratiques

### Code
- Tests avant déploiement
- Linting et formatting
- Commits atomiques

### Performance
- Optimisation des images
- Lazy loading des composants
- Bundle splitting

### Monitoring
- Surveillance des erreurs
- Métriques de performance
- Alertes automatiques

---

**🚀 Votre app est maintenant déployée et accessible partout !**

Pour toute question : [Documentation Vercel](https://vercel.com/docs)
