const passwordValidator = require("password-validator");

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

module.exports = passwordSchema;