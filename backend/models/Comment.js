const mongoose = require("mongoose");

//On créé un objet pour définir notre schéma
//ObjectId représente une classe pour notre schéma, utilisé ici pour attribuer un identifiant unique
//sous forme de string, avec notre User comme référence
let commentDefinition = {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    postId: {type: String, required: true},
    text: {type: String, required: true, maxLength: 2000},
    createdTime: {type: Date, required: true},
};

//On attribue la définition à notre schéma
let commentSchema = new mongoose.Schema(commentDefinition);

//On exporte notre modèle en précisant sa définition et son schéma
module.exports = {
    definition: commentDefinition,
    schema: commentSchema,
    model: mongoose.model("Comment", commentSchema)
};