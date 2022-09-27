//fs permet ici de gérer la modification et suppression des images, et l'API .promises nous permet
//de gérer les méthodes asynchrones plutôt que d'utiliser des callback
const fs = require("fs").promises;

const User = require('../models/User').model;
const Post = require('../models/Post').model;
const Comment = require('../models/Comment').model;

//Controller pour créer un post en route POST
exports.createPost = async (req, res, next) => {
    try {
        //On appelle notre schéma de post dans une variable
        let post = new Post({
            userId: req.auth.userId,
            likesValue: 0,
            likeUserIds: [],
            createdTime: Date.now(),
        })
        //On vérifie si une image est présente lors de la création, sinon on envoie uniquement le texte du corps de la requête
        post.text = req.file ? req.body.post : req.body.text;
        //Si le post créé contient une image, on résoud l'url complète
        post.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : "";

        //On enregistre le post avec la méthode save() et on utilise la méthode populate() de mongoose pour attribuer au post
        //l'userId, le nom et prénom de l'utilisateur qui créé le post
        const newPost = await post.save();
        await newPost.populate("userId", "firstName lastName");
        return res.status(201).json({ message: "Publication créée !", post: newPost });
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour récupérer un post en route GET
exports.getOnePost = async (req, res, next) => {
    try {
        //On récupère un post avec la méthode find()
        let post = await Post.findOne({ _id: req.params.id })
            .populate("userId", "firstName lastName")
            .lean();

        //Si le post n'est pas trouvé
        if (!post)
            return res.status(404).json({ message: "Publication non trouvée !" });
        res.status(200).json(post);
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour récupérer tous les posts en route GET
exports.getAllPosts = async (req, res, next) => {
    try {
        //On récupère tous les posts avec la méthode find()
        let posts = await Post.find()
            //On utilise la méthode sort() pour lister les posts du plus nouveau au plus ancien
            //en récupérant leur date de création
            .sort({ createdTime: "descending" })
            .populate("userId", "firstName lastName")
            .lean();
        res.status(200).json(posts);
    }
    catch (error) {res.status(500).json({ error })}
}

//Controller pour mettre à jour un post en route PUT
exports.updatePost = async (req, res, next) => {
    try {
        //On attend de récupérer l'utilisateur souhaitant modifier le post, on utilise la méthode select() pour récupérer toutes
        //les informations de l'utilisateur sauf le mot de passe qui est ici inutile, et on utilise la méthode lean()
        //pour récupérer toutes les données associées à l'utilisateur qui seront retournées en tant qu'objet
        const requestingUser = await User.findOne({ _id: req.auth.userId }).select('-password').lean();
        //Si l'utilisateur n'existe pas
        if (!requestingUser)
            return res.status(403).json({ message: "Non autorisé !" });

        //On attend de récupérer les informations du post à mettre à jour
        let post = await Post.findOne({_id: req.params.id});
        //Si le post n'est pas trouvé
        if (!post)
            return res.status(404).json({ message: "Publication non trouvée !" });

        //Si l'utilisateur n'est pas l'auteur du post, ou s'il n'est pas admin, on refuse la modification
        if (post.userId != req.auth.userId && requestingUser.admin !== true)
            return res.status(403).json({ message: "Non autorisé !" });

        //On vérifie si une image est présente lors de la modification du post
        //Si c'est le cas, on résoud l'url complète et on applique le texte modifié
        const postObject = req.file ?
            {
                text: req.body.post,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            : { ...req.body };

        //On cherche le post à mettre à jour, et on applique la variable précédemment créé
        //afin d'appliquer les modifications
        await Post.updateOne({_id: req.params.id}, {...postObject, _id: req.params.id});
        res.status(200).json({ message: "Publication modifiée !" });
        
        //Si une image est déjà présente, on la supprime
        if (req.file) {
            const pictureToChange = post.imageUrl.split('/images/')[1];
            if (pictureToChange) {
                await fs.unlink(`images/${pictureToChange}`);
            }
        }
    }
    catch (error) {
        //On récupère une erreur si l'image ne peut pas être supprimée
        if (req.file)
            await fs.unlink(`images/${req.file.filename}`);
        res.status(500).json({ error });
    }
}

//Controller pour supprimer un post en route DELETE
exports.deletePost = async (req, res, next) => {
    try {
        //On attend de récupérer l'utilisateur souhaitant modifier le post, on utilise la méthode select() pour récupérer toutes
        //les informations de l'utilisateur sauf le mot de passe qui est ici inutile, et on utilise la méthode lean()
        //pour récupérer toutes les données associées à l'utilisateur qui seront retournées en tant qu'objet
        const requestingUser = await User.findOne({_id: req.auth.userId}).select('-password').lean();

        //Si l'utilisateur n'existe pas
        if (!requestingUser)
            return res.status(403).json({ message: "Non autorisé !" });

        //On attend de récupérer les informations du post à supprimer
        const post = await Post.findOne({_id: req.params.id});

        //Si le post n'est pas trouvé
        if (!post)
            return res.status(404).json({ message: "Publication non trouvée !" });

        //Si l'utilisateur n'est pas l'auteur du post, ou s'il n'est pas admin, on refuse la modification
        if (post.userId != req.auth.userId && requestingUser.admin !== true)
            return res.status(403).json({ message: "Non autorisé !" });

        //On supprime tous les commentaires avec la méthode deleteMany() de mongoose
        await Comment.deleteMany({postId: req.params.id});

        //On cherche le post à mettre à jour, et on le supprime
        await Post.deleteOne({_id: req.params.id});
        res.status(200).json({ message: "Publication supprimée !" });

        //Si le post à supprimer possède une image, on la supprime également, pour que les images ne restent pas stockées
        if (post.imageUrl !== "") {
            const filename = post.imageUrl.split('/images/')[1];
            await fs.unlink(`images/${filename}`);
        }
    }
    catch (error) { res.status(500).json({ error }) }
}

//Controller pour gérer les likes sur les posts
exports.likePost = async (req, res, next) => {
    try {
        //On attend de trouver le post à like
        let post = await Post.findOne({_id: req.params.id});

        //Si le post n'est pas trouvé
        if (!post)
            return res.status(404).json({ message: "Publication non trouvée !" });
        
        //On créé une variable pour vérifier si l'utilisateur a déjà like un post
        const hasUserLiked = post.likeUserIds.find(userId => userId == req.auth.userId);

        //On utilise un switch pour vérifier l'état du like
        switch (req.body.like) {
            //Si l'utilisateur a déjà like un post
            case 0:
                //Si l'utilisateur a déjà like, on supprime le like
                if (hasUserLiked) {
                    await Post.updateOne({_id: req.params.id}, {$inc: {likesValue: -1}, $pull: {likeUserIds: req.auth.userId}});
                    return res.status(201).json({ message: "Like supprimé" });
                }
                //Si une erreur se produit
                else {
                    return res.status(409).json({ message: "Like introuvable !" });
                }
            //Si l'utilisateur souhaite like un post
            case 1:
                //Si le like existe déjà
                if (hasUserLiked) {
                    return res.status(409).json({ error });
                }
                //S'il n'y a pas de like
                else {
                    await Post.updateOne({_id: req.params.id}, {$inc: {likesValue: 1}, $push: {likeUserIds: req.auth.userId}});
                    return res.status(201).json({ message: "Publication likée !" });
                }
            //On définit un case par défaut qui renvoie une erreur
            default :
                return res.status(400).json({ error });
        }
    }
    catch (error) { res.status(500).json({ error }) }
}