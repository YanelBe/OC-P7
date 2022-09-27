const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
    try {
        //On extrait notre token de notre requête
        const token = req.headers.authorization.split(" ")[1];
        //On décode notre token
        const decodedToken = jwt.verify(token, process.env.PRIVATETOKEN);
        //On compare l'ID associé au token à celui du corps de la requête
        req.auth = {userId: decodedToken.userId};
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Requête invalide !" });
    }
};