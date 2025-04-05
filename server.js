const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');
const CryptoJS = require('crypto-js');

const app = express();
const PORT = 3000;

const options = {
  cert: fs.readFileSync('local1.crt'),
  key: fs.readFileSync('local1.key'),
  secureProtocol: 'TLS_method', // Utilise la méthode TLS la plus sécurisée
  secureOptions: require('constants').SSL_OP_NO_SSLv2 | require('constants').SSL_OP_NO_SSLv3, // Désactive SSLv2 et SSLv3
};

// Utilisateurs simulés
const users = require('./users');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route pour afficher la page de connexion
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fonction de déchiffrement
function decrypt(ciphertext, secretKey) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);  // Renvoie le texte déchiffré
}

// Route pour traiter la connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const secretKey = 'votre_clé_secrète';

  const decryptedUsername = decrypt(username, secretKey);
  const decryptedPassword = decrypt(password, secretKey);

  console.log('Déchiffré:', decryptedUsername, decryptedPassword);  // Vérifiez dans les logs

  const user = users.find(u => u.username === decryptedUsername && u.password === decryptedPassword);

  if (!user) {
    return res.status(401).send('Identifiants invalides');
  }

  res.redirect('/accueil');
});



// Route pour la page d'accueil (page protégée)
app.get('/accueil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'accueil.html'));
});

https.createServer(options, app).listen(3000, () => {
  console.log('Serveur HTTPS démarré sur https://localhost:3000');
});
