//On importe express, qui est un framework pour NodeJS
const express = require("express");

//On importe Mongoose, qui va permettre de communiquer entre NodeJS et MongoDB
const mongoose = require("mongoose");

//On met en place le chemin d'accès à un fichier téléchargé par un utilisateur
const path = require ("path");

//On initialise Helmet, qui va sécuriser nos en-têtes HTTP
const helmet = require("helmet");

//On utilise dotenv pour utiliser des variables d'environnement,
//qui vont nous permettre entre autres de masquer nos identifiants MongoDB lors de la connexion à Mongoose
const dotenv = require("dotenv");
dotenv.config();

//On utilise mongoSanitize, qui protège de certaines tentatives d'injection
const mongoSanitize = require("express-mongo-sanitize");

//On initialise express
const app = express();

//On déclare nos différentes routes
const User = require("./routes/user");
const Post = require("./routes/post");
const Comment = require("./routes/comment");

//On se connecte à MongoDB grâce à Mongoose, en utilisant dotenv pour masquer les identifiants, disponibles dans le fichier .env
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.ceoe8ut.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connection à MongoDB échouée..."));

//On rajoute ce middleware CORS pour autoriser l'accès à notre API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
});

//On accède à helmet
app.use(helmet());

//On accède au corps de la requête (pas besoin de body-parser)
app.use(express.json());

//On accède à mongoSanitize
app.use(mongoSanitize({allowDots: true}));

//Middleware qui charge les fichiers uploadés dans le dossier "images" et ajoute des headers
app.use("/images", express.static(path.join(__dirname, "images"), {setHeaders (res, path, stat) {
    res.set("Cross-Origin-Resource-Policy", "same-site")
}}));

//Middlewares qui transmettent les requêtes vers les routes correspondantes
app.use("/api/user", User);
app.use("/api/post", Post);
app.use("/api/comment", Comment);

module.exports = app;