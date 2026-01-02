const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { insertContact, getAllContacts, getContactById, deleteContact } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permettre les requêtes depuis le frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, images)
app.use(express.static(__dirname));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API - Recevoir les données du formulaire
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, type, job, city } = req.body;

  // Validation des données de base (toujours requis)
  if (!firstName || !phone || !type) {
    return res.status(400).json({
      success: false,
      message: 'Le prénom, le téléphone et le type de demande sont requis'
    });
  }

  // Pour les devis, lastName et email sont requis
  if (type === 'devis') {
    if (!lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Pour un devis, le nom et l\'email sont requis'
      });
    }
  }

  // Validation de l'email si fourni
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }
  }

  // Insérer dans la base de données (avec les champs optionnels)
  insertContact({ 
    firstName, 
    lastName: lastName || '', 
    email: email || '', 
    phone, 
    type,
    job: job || '',
    city: city || ''
  }, (err, contact) => {
    if (err) {
      console.error('Erreur lors de l\'insertion:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement des données'
      });
    }

    res.json({
      success: true,
      message: 'Votre demande a été enregistrée avec succès',
      contact: contact
    });
  });
});

// API - Récupérer tous les contacts (pour l'admin)
app.get('/api/contacts', (req, res) => {
  getAllContacts((err, contacts) => {
    if (err) {
      console.error('Erreur lors de la récupération:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données'
      });
    }

    res.json({
      success: true,
      contacts: contacts
    });
  });
});

// API - Récupérer un contact par ID
app.get('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  getContactById(id, (err, contact) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération'
      });
    }

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }

    res.json({
      success: true,
      contact: contact
    });
  });
});

// API - Supprimer un contact
app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  deleteContact(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }

    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  });
});

// Route pour la page admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Interface admin disponible sur http://localhost:${PORT}/admin`);
});

