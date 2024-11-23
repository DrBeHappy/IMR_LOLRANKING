const bcrypt = require('bcrypt');

// Fonction pour hacher un mot de passe
const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    throw new Error("Erreur lors du hachage du mot de passe.");
  }
};

// Fonction pour vérifier un mot de passe
const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Erreur lors de la vérification du mot de passe.");
  }
};

// Exporter les fonctions pour les utiliser ailleurs
module.exports = { hashPassword, verifyPassword };
