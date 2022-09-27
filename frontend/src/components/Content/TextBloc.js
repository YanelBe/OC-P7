//Component pour gérer le bloc de texte qui s'affiche lors de la création de post ou de commentaire

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//On importe notre contexte d'authenfication et de publication de contenu
import { AuthContext, PostPublishContext } from '../../context/AuthContext';
import { createPost, updatePost } from './Posts/PostCRUD';
import { createComment, updateComment } from './Comments/CommentCRUD';

import { AiOutlineClose } from "react-icons/ai"

//On importe notre CSS
import "./TextBloc.css";

//On créé notre fonction pour le component qui affiche un bloc de contenu pour écrire du texte
export default function TextBloc(props) {

    //On récupère le contexte d'authentification
    const { token } = useContext(AuthContext);
    
    //On récupère le contexte pour la publication de contenu
    const { togglePostPublishMode } = useContext(PostPublishContext);

    //On utilise le hook useNavigate de react-router-dom pour rediriger vers une autre page
    const navigate = useNavigate();

    //On définit une variable pour définir le type de contenu
    const contentType = props.contentType;

    //On récupère l'ID du post
    const postId = props.postId;

    //On utilise le hook useState pour gérer l'état du bloc
    const [content, setContent] = useState({
        //On définit deux type de contenus, s'il s'agit d'un commentaire ou d'un post.
        //Pour un post, on a également la possibilité d'ajouter une image
        text: contentType === "editPost" || contentType === "editComment" ? props.text: "",
        image: null,
    });

    //Variable pour définir nos props
    const { togglePostEditMode, toggleCommentPublishMode, toggleCommentEditMode, refreshPost, refreshComment, insertComment } = props;


    //Fonction pour publier le contenu
    async function PublishContent() {
        let response;
        if (contentType === "editPost")
            response = await updatePost(props.id, content, token);
        else if (contentType === "createPost")
            response = await createPost(content, token);
        else if (contentType === "editComment")
            response = await updateComment(props.id, content.text, token);
        else if (contentType === "createComment")
            response = await createComment(content.text, postId, token);
        if (response.status) {
            //Si la requête n'est pas autorisée, on renvoie vers la page de connexion
            if (response.status === 401) navigate("/");
            //Sinon, on définit le contenu
            else {
                setContent({ text: "", image: null });
            }
            //Si on souhaite créer un post
            if (contentType === "createPost") {
                togglePostPublishMode();
                window.location.reload();
            //Si on souhaite modifier un post
            } else if (contentType === "editPost") {
                togglePostEditMode();
                refreshPost(props.id);
            //Si on souhaite créer un commentaire
            } else if (contentType === "createComment") {
                insertComment(response.newComment);
                toggleCommentPublishMode();
            //Si on souahite supprimer un commentaire
            } } else if (contentType === 'editComment') {
                toggleCommentEditMode();
                refreshComment(props.id, response.comment);
            //En cas d'erreur
        } else throw new Error(response);
    }

    //Fonction pour gérer l'appel d'envoi de contenu
    function handleSubmit(event) {
        event.preventDefault();
        PublishContent();
    }

    //On créé une variable pour changer le contenu du titre en fonction du type de contenu
    let boxTitle = "";
        //Si on souhaite créer un post
        if (contentType === "createPost") 
            boxTitle = "Nouvelle publication";
        //Si on souhaite modifier un post
        else if (contentType === "editPost") 
            boxTitle = "Modifier la publication";
        //Si on souhaite créer un commentaire
        else if (contentType === "createComment")
        boxTitle = "Nouveau commentaire";
        //Si on souhaite modifier un commentaire
        else if (contentType === "editComment")
            boxTitle = "Modifier le commentaire";

    //On définit une variable pour choisir l'état de la boîte de texte lorsqu'on clique sur le bouton pour la fermer
    //On active le toggle lors du clic, ce qui ferme la boîte de texte
    let closeAction;
    //Si le contenu est la création de post et qu'on souhaite le fermer
    if (contentType === "createPost")
        closeAction = togglePostPublishMode;
    //Si le contenu est l'édit de post et qu'on souhaite le fermer
    else if (contentType === "editPost") 
    closeAction = togglePostEditMode;
    //Si le contenu est la création de commentaire et qu'on souhaite le fermer
    else if (contentType === "createComment")
        closeAction = toggleCommentPublishMode;
    //Si le contenu est l'édit de commentaire et qu'on souhaite le fermer
    else if (contentType === "editComment")
        closeAction = toggleCommentEditMode;

    //Fonction pour gérer le changement de contenu
    function handleContentChange(event) {
        if (event.target.name === "text") {
            setContent({ ...content, text: event.target.value });
        } else {
            setContent({ ...content, image: event.target.files[0] });
        }
    }

    return (
        <div className="text-bloc__background">
            <div className="text-bloc__interface">
                <div className="text-bloc__top-bar">
                    <h2>{boxTitle}</h2>
                    <button className="text-bloc__close-button" onClick={closeAction}>
                        <AiOutlineClose />
                    </button>
                </div>
                <form className="text-bloc__form" onSubmit={(event) => handleSubmit(event)}>
                    <textarea id="text" name="text" placeholder="Nouveau message" value={content.text}
                        onChange={(event) => handleContentChange(event)} maxLength={5000} required autoFocus>
                    </textarea>
                    <div className="text-bloc__bottom-bar">
                        {(contentType === 'editPost' || contentType === 'createPost') && (
                            <input type="file" name="image" id="text-bloc__image-upload" onChange={(event) => handleContentChange(event)}/>
                        )}
                        <button type="submit" className="text-bloc__submit-button">
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
