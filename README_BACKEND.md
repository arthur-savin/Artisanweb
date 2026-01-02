# Guide d'Installation et d'Utilisation du Backend

## 📋 Prérequis

- **Node.js** installé sur votre ordinateur (version 14 ou supérieure)
  - Télécharger sur : https://nodejs.org/

## 🚀 Installation

### Étape 1 : Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande va installer tous les packages nécessaires :
- `express` : Framework web pour Node.js
- `cors` : Permet les requêtes depuis le frontend
- `sqlite3` : Base de données SQLite (simple, pas besoin de serveur séparé)
- `body-parser` : Pour parser les données JSON

### Étape 2 : Démarrer le serveur

```bash
npm start
```

Le serveur va démarrer sur **http://localhost:3000**

Vous devriez voir :
```
✅ Base de données connectée avec succès
✅ Table "contacts" créée ou déjà existante
🚀 Serveur démarré sur http://localhost:3000
📊 Interface admin disponible sur http://localhost:3000/admin
```

## 📁 Structure des Fichiers

```
├── server.js          # Serveur Express et routes API
├── database.js         # Gestion de la base de données SQLite
├── admin.html          # Interface d'administration
├── package.json        # Dépendances du projet
├── contacts.db         # Base de données SQLite (créée automatiquement)
└── index.html          # Page principale (modifiée pour envoyer au backend)
```

## 🔌 API Endpoints

### POST `/api/contact`
Envoie les données du formulaire de contact.

**Body (JSON) :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0612345678",
  "type": "appel"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Votre demande a été enregistrée avec succès",
  "contact": { ... }
}
```

### GET `/api/contacts`
Récupère toutes les demandes de contact (pour l'admin).

### GET `/api/contacts/:id`
Récupère une demande spécifique par son ID.

### DELETE `/api/contacts/:id`
Supprime une demande de contact.

## 🎯 Utilisation

### 1. Page principale
- Ouvrez http://localhost:3000
- Remplissez le formulaire de contact
- Les données sont automatiquement enregistrées dans la base de données

### 2. Interface Admin
- Ouvrez http://localhost:3000/admin
- Visualisez toutes les demandes
- Consultez les statistiques
- Supprimez des demandes si nécessaire

## 💾 Base de Données

La base de données SQLite est créée automatiquement dans le fichier `contacts.db`.

**Structure de la table `contacts` :**
- `id` : Identifiant unique (auto-incrémenté)
- `prenom` : Prénom du contact
- `nom` : Nom du contact
- `email` : Email du contact
- `telephone` : Numéro de téléphone
- `type_demande` : Type de demande ("appel" ou "devis")
- `date_creation` : Date et heure de création (automatique)

## 🔧 Configuration

### Changer le port du serveur

Modifiez la variable `PORT` dans `server.js` :
```javascript
const PORT = process.env.PORT || 3000; // Changez 3000 par le port souhaité
```

### Sauvegarder la base de données

Le fichier `contacts.db` contient toutes vos données. Pour faire une sauvegarde :
- Copiez simplement le fichier `contacts.db`
- Pour restaurer, remplacez le fichier par votre sauvegarde

## 🐛 Dépannage

### Erreur "Cannot find module"
- Vérifiez que vous avez bien exécuté `npm install`
- Vérifiez que vous êtes dans le bon dossier

### Erreur "Port already in use"
- Un autre programme utilise le port 3000
- Changez le port dans `server.js` ou arrêtez l'autre programme

### La base de données ne se crée pas
- Vérifiez les permissions d'écriture dans le dossier
- Vérifiez les logs dans la console pour voir les erreurs

## 📊 Fonctionnalités de l'Interface Admin

- **Statistiques en temps réel** : Total, appels, devis, demandes du jour
- **Tableau complet** : Toutes les informations des contacts
- **Actions** : Suppression de demandes
- **Actualisation** : Bouton pour recharger les données

## 🔒 Sécurité (À améliorer pour la production)

Pour un environnement de production, vous devriez :
- Ajouter une authentification pour l'interface admin
- Utiliser HTTPS
- Ajouter une validation côté serveur plus stricte
- Limiter le taux de requêtes (rate limiting)
- Utiliser des variables d'environnement pour les configurations sensibles

## 📝 Notes

- La base de données SQLite est parfaite pour commencer
- Pour plus de trafic, vous pouvez migrer vers MySQL ou PostgreSQL
- Toutes les données sont stockées localement dans `contacts.db`

