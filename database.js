const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'contacts.db');

// Créer ou ouvrir la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
  } else {
    console.log('✅ Base de données connectée avec succès');
    // Créer la table si elle n'existe pas
    createTable();
  }
});

// Créer la table pour stocker les contacts
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT NOT NULL,
      type_demande TEXT NOT NULL,
      date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('✅ Table "contacts" créée ou déjà existante');
    }
  });
}

// Insérer un nouveau contact
function insertContact(contact, callback) {
  const sql = `
    INSERT INTO contacts (prenom, nom, email, telephone, type_demande)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    contact.firstName,
    contact.lastName,
    contact.email,
    contact.phone,
    contact.type
  ], function(err) {
    if (err) {
      console.error('Erreur lors de l\'insertion:', err.message);
      callback(err, null);
    } else {
      console.log(`✅ Contact inséré avec l'ID: ${this.lastID}`);
      callback(null, { id: this.lastID, ...contact });
    }
  });
}

// Récupérer tous les contacts
function getAllContacts(callback) {
  const sql = `SELECT * FROM contacts ORDER BY date_creation DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Récupérer un contact par ID
function getContactById(id, callback) {
  const sql = `SELECT * FROM contacts WHERE id = ?`;
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération:', err.message);
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// Supprimer un contact
function deleteContact(id, callback) {
  const sql = `DELETE FROM contacts WHERE id = ?`;
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Erreur lors de la suppression:', err.message);
      callback(err, null);
    } else {
      callback(null, { deleted: this.changes > 0 });
    }
  });
}

// Fermer la connexion à la base de données
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture:', err.message);
    } else {
      console.log('✅ Base de données fermée');
    }
  });
}

module.exports = {
  insertContact,
  getAllContacts,
  getContactById,
  deleteContact,
  closeDatabase
};

