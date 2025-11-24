# 🥩 JambonRider

Application mobile de gestion de matériel vidéo. Organisez vos sacs, vérifiez votre équipement, et ne laissez plus rien derrière vous !

## 🎯 Fonctionnalités

- ✅ **Authentification** - Accès sécurisé par mot de passe
- 📦 **Gestion des sacs** - Créer, modifier, supprimer des sacs
- 📝 **Gestion des objets** - Ajouter du matériel avec quantité, description, et tags
- ✓ **Checklist interactive** - Cocher les objets vérifiés avec barre de progression
- 🎒 **Statuts automatiques** - Vide / Prêt / Chargé
- 💾 **Stockage local** - Données persistantes avec localStorage
- 📱 **Mobile-first** - Design responsive optimisé pour smartphone
- 🌑 **Dark mode rétro** - Interface sombre et sobre

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/t0rbenC0rtes/JambonRider.git
cd JambonRider

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier le mot de passe dans .env
# VITE_APP_PASSWORD=votre_mot_de_passe

# Lancer le serveur de développement
npm run dev
```

### Déploiement sur Vercel

1. **Connecter votre repository GitHub:**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez le repository `t0rbenC0rtes/JambonRider`

2. **Configurer les variables d'environnement:**
   - Dans les paramètres du projet Vercel
   - Ajoutez: `VITE_APP_PASSWORD` avec votre mot de passe

3. **Déployer:**
   - Vercel détectera automatiquement Vite
   - Cliquez sur "Deploy"
   - Votre app sera accessible à l'URL fournie

### Variables d'environnement requises

```env
VITE_APP_PASSWORD=votre_mot_de_passe_securise
```

## 🛠️ Stack technique

- **Frontend:** React 18 + Vite
- **State Management:** Zustand
- **Routing:** React Router v6
- **Styling:** CSS custom (mobile-first)
- **Storage:** localStorage (Phase 1)
- **Deployment:** Vercel

## 📋 Roadmap

### Phase 1 - MVP ✅
- [x] Authentification
- [x] CRUD Sacs & Objets
- [x] Système de checklist
- [x] Statuts automatiques
- [x] localStorage
- [x] Design dark rétro

### Phase 2 - À venir 🚧
- [ ] Upload & compression d'images
- [ ] Accès caméra mobile
- [ ] Intégration Supabase
- [ ] Sync multi-utilisateurs
- [ ] Mode hors-ligne (PWA)

### Phase 3 - Futur 💡
- [ ] Templates de configuration
- [ ] Barre de recherche
- [ ] Historique des chargements
- [ ] Export PDF/CSV

## 📱 Utilisation

1. **Connexion** - Entrez le mot de passe
2. **Créer des sacs** - Ajoutez vos différents sacs de matériel
3. **Ajouter des objets** - Listez tout le contenu de chaque sac
4. **Au moment du chargement:**
   - Ouvrez un sac
   - Cochez chaque objet vérifié
   - Quand tout est coché → statut "Prêt"
   - Marquez comme "Chargé" pour finaliser

## 🎨 Design

- Palette: Noir, vert foncé, marron, crème
- Typographie: Courier New (monospace)
- Logo: Jambon.jpg
- Look: Rétro & minimaliste

## 📄 License

MIT

## 👤 Auteur

**Torben Cortes**
- GitHub: [@t0rbenC0rtes](https://github.com/t0rbenC0rtes)

---

Made with 🥩 by Claude & Torben

