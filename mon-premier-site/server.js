const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path"); // Importez path pour gérer les chemins de fichier
const fs = require("fs");
const { verifyPassword, hashPassword } = require('./src/helpers/passwordhelper.js');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key";


// Middleware pour traiter les JSON
app.use(express.json());
// Middleware pour analyser le JSON
app.use(bodyParser.json());

// Fonction pour lire les utilisateurs depuis le fichier JSON
const getUsers = () => {
  try {
    const filePath = path.join(__dirname, 'src', 'data', 'users.json');  // Assure-toi du bon chemin
    const data = fs.readFileSync(filePath, 'utf8');  // Lire le fichier JSON
    const users = JSON.parse(data).users;  // Récupérer la liste des utilisateurs
    return users;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    throw error;  // Propager l'erreur si le fichier ne peut pas être lu
  }
};

app.post('/register', async (req, res) => {
    
    const { username, password } = req.body;
    const users = getUsers();
    console.log("coucou");

    const userExists = users.find((user) => user.username === username);
    if (userExists) {
        return res.status(400).send("Nom d'utilisateur déjà utilisé.");
    }
    try {
      const hashedPassword = await hashPassword(password); // Utilise la fonction hachage
      const newUser = { id: users.length + 1, username, passwordHash: hashedPassword };
      users.push(newUser); // Enregistre l'utilisateur
      res.status(201).json({ message: 'Utilisateur enregistré avec succès !' });
      fs.writeFileSync(path.join(__dirname, 'src', 'data', 'users.json'), JSON.stringify({ users }, null, 2));
      res.status(201).send("Inscription réussie !");
    } catch (error) {
        console.error('Erreur capturée dans le catch:', error); // Logue l'erreur pour la déboguer
        res.status(500).json({ error: 'ErreuDDr lors de l\'inscription.' });
    }
  });
// API de connexion
// Route de connexion
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }
  
    const users = getUsers(); // Lire les utilisateurs depuis le fichier JSON
    const user = users.find((u) => u.username === username); // Trouver l'utilisateur
  
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
  
    const isPasswordValid = await verifyPassword(password, user.passwordHash); // Vérifie le mot de passe
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }
  
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" }); // Générer un token
  
    res.json({ success: true, message: "Connexion réussie !", token });
  });

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ 
        message: "Pas de token fourni." 
      });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY); // Vérifier le token
      req.user = decoded; // Ajouter l'utilisateur décodé à la requête
      next();
    } catch (err) {
      console.error("Erreur de vérification du token:", err);
      return res.status(403).json({ 
        success: false, 
        message: 'Token invalide ou expiré', 
        error: err.message 
      });
  
    }
}



// Route protégée (Dashboard)
app.get("/dashboard", verifyToken, (req, res) => {
  console.log("Requête reçue sur /dashboard");
  console.log("Utilisateur authentifié:", req.user);
  res.json({
    success: true,
    message: `Bienvenue ${req.user.username}! Vous êtes connecté.`,
    user: req.user,
  });
});

// Déclare toutes les routes API ici
//app.use("/api", apiRouter); // Exemple : routes API

// Puis configure les fichiers statiques
app.use(express.static(path.join(__dirname, "build")));

// Fallback pour les routes non trouvées (serve `index.html` pour React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
  
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });





