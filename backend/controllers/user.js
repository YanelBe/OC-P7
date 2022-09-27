const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");

const passwordValidator = require("password-validator");

const User = require("../models/User").model;

//On définit notre controller pour créer un compte
exports.signup = async (req, res, next) => {
    try {
        //On valide le format de l'adresse mail grâce au package email-validator
        const isEmailValid = emailValidator.validate(req.body.email);
        //Si le format n'est pas valide, on renvoie une erreur
        if (!isEmailValid)
            return res.status(400).json({ message: "Le format de l'adresse email est incorrect !" })

        //On créé un schéma de mot de passe
        const passwordSchema = new passwordValidator();

        //On rajoute les conditions associées à notre mot de passe
        passwordSchema
            .is().min(8)                                    // Mimnimum 8 caractères
            .is().max(100)                                  // Maximum 100 caractères
            .has().uppercase()                              // Au moins une majuscule
            .has().lowercase()                              // Au moins une minuscule
            .has().digits()                                 // Au moins 1 chiffre
            .has().symbols()                                // Au moins un caractère spécial
            .has().not().spaces()                           // Pas d'espaces

        //On valide le format du mot de passe grâce à notre schéma
        if (!passwordSchema.validate(req.body.password))
            return res.status(400).json({ message: "Le mot de passe est invalide !" });

        //On hash le mot de passe
        let hash = await bcrypt.hash(req.body.password, 10);

        //On créé un nouvel utilisateur depuis notre modèle
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            admin: false
        });
        //On attend la création de l'utilisateur avec la méthode save(), et on renvoie un statu 201
        await user.save();
        res.status(201).json({ message: "Compte créé !" });
    }
    catch (error) {
        //On renvoie une si l'adresse email est déjà présente dans la base de données
        if (error.errors.email && error.errors.email.properties.type === "unique") {
            res.status(409).json({ error });
        } else {res.status(500).json({ error }) }
    }
};

//On définit notre controller pour se connecter à un compte
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).lean();
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        
        if (!user)
            return res.status(404).json({error: "Le mot de passe ou l'adresse e-mail est invalide !"});
        if (!validPassword)
            return res.status(401).json({error: "Le mot de passe est invalide !"});

        res.status(200).json({
            token: jwt.sign(
                {userId: user._id, admin: user.admin,},
                process.env.PRIVATETOKEN,
                {expiresIn: '24h'}
            )
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};