const mongoose = require("mongoose");

//On créé un objet pour définir notre schéma
//ObjectId représente une classe pour notre schéma, utilisé ici pour attribuer un identifiant unique
//sous forme de string, avec un User comme référence
let postDefinition = {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true, maxLength: 2000},
    imageUrl: {type: String},
    likesValue: {type: Number, required: true},
    likeUserIds: {type: Array, required: true},
    createdTime: {type: Date, required: true},
};

//On attribue la définition à notre schéma
let postSchema = new mongoose.Schema(postDefinition);

//On exporte notre modèle en précisant sa définition et son schéma
module.exports = {
    definition: postDefinition,
    schema: postSchema,
    model: mongoose.model("Post", postSchema)
};