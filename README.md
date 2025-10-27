# Post App

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?logo=angular&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white)](#)

<h3>Application de réseau social</h3>

Application de réseau social, permettant aux utilisateurs de mettre en ligne des posts et envoyer des messages privés.

</div>

## 🌟 Fonctionnalités

- **Authentification Firebase**: Utilisation de Firebase pour gérer l'authentification des utilisateurs.
- **Gestion des utilisateurs**: Affichage et modification des profils utilisateurs, fonctionnalité de follow et unfollow.
- **Création de posts**: Ajout de nouveaux posts avec titre, contenu et date de publication.
- **Affichage des posts**: Affichage des posts des utilisateurs avec leur photo de profil et leurs détails.
- **Modération de profil**: Édition du profil utilisateur (nickname, bio, photo de profil).
- **Firebase Firestore**: Sauvegarde et récupération des données des utilisateurs et des posts à partir de Firestore.
- **Messages et conversations**: Implémentation d'une fonctionnalité de messagerie avec affichage des conversations et envoi de messages en temps réel.
- **Recherche**: Page de recherche pour rechercher des posts ou des utilisateurs.

## 📂 Structure du projet

```plaintext
src/
├── app/
│   ├── components/               # Composants Angular (dialogs, etc.)
│   ├── models/                   # Modèles (User, Post, etc.)
│   ├── services/                 # Services Angular (auth, user, post, message)
│   ├── pages/                    # Pages principales (Home, Profile, etc.)
│   ├── app.module.ts             # Module principal d'Angular
│   ├── app-routing.module.ts     # Configuration des routes
└── assets/                       # Ressources statiques (images, etc.)
```

## 🚀 Installation et Lancement

1. **Cloner le projet**

   Clonez le projet depuis GitHub sur votre machine locale :

   ```bash
   git clone https://github.com/your-username/project-name.git
   ```

2. **Installation des dépendances**

   Accédez au répertoire du projet et installez les dépendances avec npm :

   ```bash
   cd project-name
   npm install
   ```

3. **Configuration de Firebase**

   - Créez un projet sur [Firebase Console](https://console.firebase.google.com/).
   - Ajoutez une nouvelle application Web.
   - Copiez les informations de configuration de Firebase (API Key, Auth Domain, etc.) et ajoutez-les dans le fichier `src/environments/env.dev.ts`.

   Exemple :
   
   ```ts
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: 'your-api-key',
       authDomain: 'your-auth-domain',
       projectId: 'your-project-id',
       storageBucket: 'your-storage-bucket',
       messagingSenderId: 'your-messaging-sender-id',
       appId: 'your-app-id',
     }
   };
   ```

4. **Lancer le projet**

   Une fois les dépendances installées et la configuration de Firebase effectuée, lancez l'application Angular :

   ```
   ng serve
   ```

   Ouvrez votre navigateur et allez sur [http://localhost:4200](http://localhost:4200) pour voir l'application en action.

## 🛠️ Technologies Utilisées

- **Angular**: Framework JavaScript pour construire l'application web.
- **Firebase**: Utilisé pour l'authentification des utilisateurs et la gestion des bases de données (Firestore).
- **Angular Material**: Composants UI pour une meilleure expérience utilisateur.
- **TailwindCSS**: Utilisé pour le style et la mise en page réactive.
- **Font Awesome**: Pour les icônes de navigation (Accueil, Recherche, Messages).
- **Custom Date Pipe**: Utilisé pour formater les dates et afficher des dates relatives pour les posts.

## ✨ Fonctionnalités Récentes
### 💬 Messages et Conversations
- **Conversations**: La page des conversations a été ajoutée, permettant aux utilisateurs de voir et de discuter avec leurs contacts.
- **Footer avec icônes de navigation**: Un footer fixe a été ajouté avec des icônes de navigation. L'icône devient bleue lorsqu'elle est active.
- **Recherche**: Fonctionalité de recherche permettant de rechercher des posts ou des utilisateurs.

### 📅 Gestion des Posts
- **Réponses aux posts**: Les utilisateurs peuvent répondre aux posts et voir les réponses immédiatement grâce à la fonctionnalité en temps réel.
- **Affichage des posts**: Affichage des posts et des réponses sur les pages de profil et d'accueil, avec des icônes et un bouton pour aimer et commenter.

### 🔄 Améliorations
- **Redirection et Auth Guard**: Le projet a été mis à jour pour gérer la redirection après la connexion et sécuriser les routes avec un auth guard.
- **Page 404**: Une page 404 a été ajoutée pour gérer les routes inexistantes.

## 📜 Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).

