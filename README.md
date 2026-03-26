# ForgeHub - L'Elite de la Création Entrepreneuriale

ForgeHub est une plateforme de formation et de suivi stratégique pour les entrepreneurs. Inspirée par la méthode "The First 100" de Ben Lee, elle guide les bâtisseurs de l'idée brute à leurs 100 premiers clients.

## 🎨 Design System: "The Stoic Commander"

ForgeHub utilise un système de design éditorial haut de gamme nommé **"The Stoic Commander"**.

- **Philosophie**: Rejet de l'esthétique utilitaire encombrée au profit d'une expérience éditoriale. Priorité à l'asymétrie intentionnelle, au vide et à une typographie dramatique.
- **Palette de Couleurs**:
    - **Oxblood Red** (#570005): Pour les moments d'impact et l'identité.
    - **Slate Architectural Grays**: Pour une structure calme et précise.
- **Typographie**:
    - **Manrope**: Pour les titres (précision géométrique).
    - **Inter**: Pour le corps de texte (lisibilité utilitaire).
- **Effets**: Glassmorphism sur les en-têtes et navigation, ombres diffuses et "No-Line rule" (sectionnement par décalage de couleur de fond).

## 🚀 Déploiement

Le projet est configuré pour un déploiement automatique sur VPS via GitHub Actions.

### Prérequis VPS

- Node.js 20+
- PM2 (`npm install -g pm2`)
- Répertoire de destination: `/opt/forgehub`

### Secrets GitHub à configurer

Pour que le déploiement fonctionne, configurez les secrets suivants dans votre dépôt GitHub:

- `VPS_HOST`: Adresse IP de votre VPS.
- `VPS_USER`: Utilisateur SSH.
- `VPS_SSH_KEY`: Clé privée SSH.
- `VITE_FIREBASE_API_KEY`: Clé API Firebase.
- `VITE_FIREBASE_AUTH_DOMAIN`: Domaine d'authentification Firebase.
- `VITE_FIREBASE_PROJECT_ID`: ID du projet Firebase.
- `VITE_FIREBASE_APP_ID`: ID de l'application Firebase.
- `VITE_FIREBASE_FIRESTORE_DATABASE_ID`: ID de la base de données Firestore.

## 🛠️ Développement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Lancement du serveur de production localement
npm start
```

## 🔒 Sécurité

La sécurité est gérée par **Firebase Auth** et les **Firestore Security Rules**. Les règles sont conçues pour garantir que chaque utilisateur ne peut accéder qu'à ses propres données stratégiques.
