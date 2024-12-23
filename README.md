# Project Name

## 🌟 Fonctionnalités

- **Authentification Firebase**: Utilisation de Firebase pour gérer l'authentification des utilisateurs.
- **Gestion des utilisateurs**: Affichage et modification des profils utilisateurs.
- **Création de posts**: Ajout de nouveaux posts avec titre, contenu et date de publication.
- **Affichage des posts**: Affichage des posts des utilisateurs avec leur photo de profil et leurs détails.
- **Modération de profil**: Édition du profil utilisateur (nickname, bio, photo de profil).
- **Firebase Firestore**: Sauvegarde et récupération des données des utilisateurs et des posts à partir de Firestore.

## 📂 Structure du projet

```plaintext
src/
├── app/
│   ├── components/               # Composants Angular (dialogs, etc.)
│   ├── models/                   # Modèles (User, Post, etc.)
│   ├── services/                 # Services Angular (auth, user, post)
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
   - Copiez les informations de configuration de Firebase (API Key, Auth Domain, etc.) et ajoutez-les dans le fichier `src/environments/environment.ts`.

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

## 📜 Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).

