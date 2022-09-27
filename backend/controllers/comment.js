
const User = require('../models/User').model;
const Post = require('../models/Post').model;
const Comment = require('../models/Comment').model;

//On créé notre route CRUD pour les commentaires

//Controller pour créer un nouveau commentaire en route POST
exports.createComment = async (req, res, next) => {
    //Notre fonction est asynchrone, on utilise un "try"
    try {
        //On fait appel à notre schéma de commentaire, auquel on ajoute
        const comment = new Comment({
            //On récupère le corps de la requête, on y associe l'heure à laquelle le commentaire à été créé
            //et on attribue l'userId du post à son auteur
            ...req.body,
            userId: req.auth.userId,
            createdTime: Date.now()
        });
        //On enregistre le commentaire, et on utilise la méthode populate() de mongoose pour attribuer aux commentaires
        //l'userId, le nom et prénom de l'utilisateur qui commente
        const savedComment = await comment.save();
        await savedComment.populate("userId", "firstName lastName");
        //On retourne un message de validation et on ajoute le commentaire créé
        return res.status(201).json({message: "Comment created !", comment: savedComment});
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour récupérer tous les commentaires d'un post en route GET
exports.getAllComments = async (req, res, next) => {
    try {
        //On utilise la méthode findOne() pour récupérer les données d'un post, puis la méthode lean()
        //pour récupérer toutes les données associées au post qui seront retournées en tant qu'objets
        let post = await Post.findOne({_id: req.params.postId}).lean();
        //Si aucun post n'a été trouvé
        if (!post)
            return res.status(404).json({message: "Publication non trouvée !"});
        //On définit une variable qui contient un nouveau commentaire
        let comments = await Comment
            //on utilise la méthode .find() pour trouver un postId unique du post sur lequel on souhaite commenter
            .find({ postId: req.params.postId })
            //On utilise la méthode populate() pour y associer l'userId, le nom et prénom de celui qui commente
            .populate("userId", "firstName lastName")
            //On utilise la méthode sort() pour que les commentaires soient classés par ordre ascendant
            .sort({ createdTime: "ascending" })
            //Puis on utilise lean() pour retourner les données de la requête en objet
            .lean();
        //Enfin, on retourne les commentaires avec un status 200
        res.status(200).json(comments);
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour mettre à jour un commentaire en route PUT
exports.updateComment = async (req, res, next) => {
    try {
        //On attend de récupérer l'utilisateur souhaitant modifier le commentaire, on utilise la méthode select() pour récupérer toutes
        //les informations de l'utilisateur sauf le mot de passe qui est ici inutile, et on utilise la méthode lean()
        const requestingUser = await User.findOne({_id: req.auth.userId}).select("-password").lean();

        //S'il n'y a pas les infos de l'utilisateur
        if (!requestingUser)
            return res.status(403).json({ message: "Non autorisé !" });

        //On recherche le commentaire qui doit être modifié
        let comment = await Comment.findOne({_id: req.params.id});
        //Si le commentaire n'est pas trouvé
        if (!comment)
            return res.status(404).json({ message: "Commentaire non trouvé !" });

        //Si l'utilisateur n'est pas l'auteur du commentaire, ou s'il n'est pas admin, on refuse
        if (comment.userId != req.auth.userId && requestingUser.admin !== true)
            return res.status(403).json({ message: "Non autorisé !" });
        
        //On attend de  récupérer les données du commentaire à mettre à jour
        await Comment.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id});
        //On cherche le commentaire à mettre à jour, et on utilise la méthode populate() de mongoose
        //pour attribuer aux commentaire l'userId, le nom et prénom de l'utilisateur qui commente
        comment = await Comment.findOne({_id: req.params.id}).populate("userId", "firstName lastName");
        res.status(200).json({ message: "Commentaire modifié !", comment });
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour supprimer un commentaire en route DELETE
exports.deleteComment = async (req, res, next) => {
    try {
        //On attend de récupérer l'utilisateur souhaitant modifier le commentaire, on utilise la méthode select() pour récupérer toutes
        //les informations de l'utilisateur sauf le mot de passe qui est ici inutile, et on utilise la méthode lean()
        const requestingUser = await User.findOne({_id: req.auth.userId}).select('-password').lean();

        //S'il n'y a pas les infos de l'utilisateur
        if (!requestingUser)
            return res.status(403).json({ message: "Non autorisé !" });

        //On recherche le commentaire qui doit être supprimé
        let comment = await Comment.findOne({_id: req.params.id});

        //Si le commentaire n'est pas trouvé
        if (!comment)
            return res.status(404).json({ message: "Commentaire non trouvé !" });

        //Si l'utilisateur n'est pas l'auteur du commentaire, ou s'il n'est pas admin, on refuse
        if (comment.userId != req.auth.userId && requestingUser.admin !== true)
            return res.status(403).json({ message: "Non autorisé !" });

        //On attend de  récupérer les données du commentaire, et on le supprime
        await Comment.deleteOne({_id: req.params.id});
        res.status(200).json({ message: "Commentaire supprimé !" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}