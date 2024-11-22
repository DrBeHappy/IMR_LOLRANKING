const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // À remplacer par une clé secrète sécurisée.

const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
    { id: 3, username: "user3", password: "password3" },
  ];
  

app.use(bodyParser.json());

// Charger les utilisateurs depuis le JSON
const getUsers = () => {
  const data = fs.readFileSync("users.json", "utf8");
  return JSON.parse(data).users;
};

// Enregistrer les utilisateurs dans le JSON
const saveUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify({ users }, null, 2));
};

// Inscription
/*app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send("Tous les champs sont requis !");
  }

  const users = getUsers();
  const userExists = users.find((u) => u.username === username || u.email === email);

  if (userExists) {
    return res.status(400).send("Nom d'utilisateur ou e-mail déjà utilisé.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    passwordHash: hashedPassword,
    role: "user",
    lastLogin: null
  };

  users.push(newUser);
  saveUsers(users);
  res.status(201).send("Inscription réussie !");
});

// Connexion
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Nom d'utilisateur et mot de passe requis !");
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).send("Utilisateur non trouvé.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).send("Mot de passe incorrect.");
  }

  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Connexion réussie !", token });
});*/
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Vérifier si l'utilisateur existe
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      // Créer un token JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },  // Payload (ce que tu veux stocker dans le token)
        'votre_clé_secrète',                          // Clé secrète pour signer le token
        { expiresIn: '1h' }                           // Durée d'expiration du token (ici 1h)
      );
  
      // Répondre avec le token
      res.json({ success: true, message: 'Connexion réussie', token: token });
    } else {
      res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }
  });
  

// Déconnexion (optionnel côté backend, sinon détruire le token côté client)
app.post("/logout", (req, res) => {
  res.json({ message: "Déconnecté avec succès !" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

app.get('/test', (req, res) => {
    res.json({ message: "Route test fonctionne !" });
});

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(403).json({ success: false, message: 'Pas de token fourni' });
    }
  
    try {
      const decoded = jwt.verify(token, 'votre_clé_secrète');  // Vérifier le token
      req.user = decoded;  // Ajouter l'utilisateur décodé dans la requête
      next();  // Passer à la suite
    } catch (err) {
      res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
    }
  }

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: `Bienvenue ${req.user.username}! Vous êtes connecté.`,
        user: req.user
    });
});

  
  