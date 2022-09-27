const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//On créé un objet pour définir notre schéma, on utilise mongoose-unique-validator
//pour s'assurer que l'adresse mail entrée est unique. L'utilisateur n'est pas admin par défaut
const userDefinition = {
    firstName: {type: String, required: true, maxLength: 40},
    lastName: {type: String, required: true, maxLength: 40},
    email: {type: String, required: true, unique: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    admin: {type: Boolean, required: true, default: false}
}

//On attribue la définition à notre schéma, et on utilise le plugin mongoose-unique-validator
const userSchema = new mongoose.Schema(userDefinition);
userSchema.plugin(uniqueValidator);

//On exporte notre modèle en précisant sa définition et son schéma
module.exports = {
    definition: userDefinition,
    schema: userSchema,
    model: mongoose.model("User", userSchema)
};