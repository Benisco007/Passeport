# 🔧 Guide de configuration — BIO DATA

## Fichiers du projet
```
biodata/
├── index.html   → Formulaire de saisie
├── view.html    → Fiche finale (destinataire)
├── style.css    → Tous les styles
├── app.js       → Logique Firebase
└── README.md    → Ce fichier
```

---

## ÉTAPE 1 — Créer un projet Firebase (gratuit)

1. Aller sur https://console.firebase.google.com
2. Cliquer **"Ajouter un projet"**
3. Donner un nom : `biodata-app` (par exemple)
4. Désactiver Google Analytics (pas nécessaire) → **Créer**

---

## ÉTAPE 2 — Activer Firestore

1. Dans le menu gauche → **Firestore Database**
2. Cliquer **"Créer une base de données"**
3. Choisir **Mode test** (pour commencer)
4. Choisir la région → **Continuer**

---

## ÉTAPE 3 — Activer Storage

1. Dans le menu gauche → **Storage**
2. Cliquer **"Commencer"**
3. Mode test → **Suivant** → **Terminer**

---

## ÉTAPE 4 — Récupérer les clés de configuration

1. ⚙️ (Paramètres du projet) → **Paramètres du projet**
2. Faire défiler jusqu'à **"Vos applications"**
3. Cliquer l'icône **</>** (Web)
4. Donner un surnom → **Enregistrer l'application**
5. Copier l'objet `firebaseConfig` affiché

---

## ÉTAPE 5 — Coller les clés dans les fichiers

### Dans `app.js` (ligne 14) :
```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "biodata-app.firebaseapp.com",
  projectId:         "biodata-app",
  storageBucket:     "biodata-app.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc..."
};
```

### Dans `view.html` (même bloc firebaseConfig) :
Coller exactement les mêmes clés.

---

## ÉTAPE 6 — Déployer sur GitHub Pages (gratuit)

1. Créer un compte sur https://github.com si pas encore fait
2. Créer un nouveau dépôt public : `biodata-app`
3. Uploader les 4 fichiers : `index.html`, `view.html`, `style.css`, `app.js`
4. Aller dans **Settings** → **Pages**
5. Source : **Deploy from a branch** → branche `main` → dossier `/root`
6. Cliquer **Save**

Votre app sera disponible sur :
`https://VOTRE_USERNAME.github.io/biodata-app/`

---

## ÉTAPE 7 — Autoriser votre domaine dans Firebase

1. Console Firebase → **Authentication** → **Paramètres** → **Domaines autorisés**
2. Ajouter : `VOTRE_USERNAME.github.io`

---

## Flux complet une fois déployé

```
Utilisateur ouvre index.html
    ↓
Remplit le formulaire + uploade photo
    ↓
Clique "Générer le lien"
    ↓
Photo → Firebase Storage
Données → Firebase Firestore
    ↓
Lien généré : /view.html?id=abc123
    ↓
Destinataire ouvre le lien
→ Voit la fiche complète (texte + photo)
→ Peut télécharger en PDF
```

---

## ⚠️ Règles de sécurité Firebase (production)

Pour la production, remplacer les règles test par :

### Firestore :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fiches/{ficheId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if false;
    }
  }
}
```

### Storage :
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{photoId} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```
