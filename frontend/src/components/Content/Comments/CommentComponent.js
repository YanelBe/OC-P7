
import { useState, useContext } from "react";

//On importe notre contexte d'authentification
import { AuthContext } from "../../../context/AuthContext";

//On importe le component pour le bloc de texte qui permet de rédiger un commentaire
import TextBloc from "../TextBloc";

//On importe notre fonction pour formater la date
import formatTime from '../../../utils/Time';

import { BsThreeDotsVertical } from "react-icons/bs";

import "./Comment.css"

//Fonction pour gérer les commentaires
export default function Comment(props) {
    //On utilise le contexte d'authentification
    const { userId, admin } = useContext(AuthContext);

    //On utilise notre fonction pour formater la date de création du commentaire
    const creationTime = formatTime(props.createdTime);

    //On définit un hook useState pour suivre l'état d'affichage du menu de commentaire
    const [isCommentMenuVisible, setIsCommentMenuVisible] = useState(false);

    //On définit la fonction qui fait appel au hook d'affichage du menu de commentaire
    function showCommentMenu() {
        setIsCommentMenuVisible(!isCommentMenuVisible);
    }

    //On définit les props pour gérer la suppression et le refresh des commentaires
    const { refreshComment, handleDeleteComment } = props;

    //On définit un hook useState pour éditer les commentaires
    const [commentEditMode, setCommentEditMode] = useState(false);

    //On définit la fonction qui fait appel au hook pour l'affichage du menu de commentaire
    const toggleCommentEditMode = () => {
        setCommentEditMode(!commentEditMode);
    };

    //On récupère l'id du HTML auquel on ajoute l'id du commentaire
    const deleteCommentDialog = document.getElementById(`deleteCommentDialog-${props.id}`); 
    
    //On définit la fonction qui permet d'affichage du message de confirmation pour la suppression d'un commentaire
    function showDeleteCommentDialog() {
        deleteCommentDialog.showModal();
    }

    return (
        <div className="comment-box">
            <div>
                <div className="comment-box__content">
                    <p className="comment-box__name">
                        {`${props.author.firstName} ${props.author.lastName}`}
                    </p>
                    <p className="comment-box__text">{props.text}</p>
                </div>
                <p className="comment-box__create-time">{creationTime}</p>
            </div>

            {(admin === true || admin === 'true' || userId === props.author._id) && (
                <div className="comment-box__actions" onClick={() => showCommentMenu()}>
                    <button className="comment-box__menu_opener"><BsThreeDotsVertical/></button>
                    {isCommentMenuVisible && (
                        <div className="comment-box__actions-menu">
                            <button className="comment-box__modify-button" title="Modifier ce commentaire" onClick={toggleCommentEditMode}>
                                Modifier
                            </button>
                            <button className="comment-box__delete-button" title="Supprimer ce commentaire" onClick={() => showDeleteCommentDialog()}>
                                Supprimer
                            </button>
                        </div>
                    )}
                    {commentEditMode ? (
                        <TextBloc
                            id={props.id}
                            userId={props.userId}
                            text={props.text}
                            toggleCommentEditMode={toggleCommentEditMode}
                            refreshComment={refreshComment}
                            contentType="editComment"/>
                    ) : (
                        <></>
                    )}
                </div>
            )}
            <dialog className="delete-box" id={`deleteCommentDialog-${props.id}`}>

                <form method="dialog">
                    <p>Souhaitez-vous réellement supprimer ce commentaire ?</p>
                    <div className="delete-box__button-div">
                        <button value="cancel" className="delete-box__button" autoFocus>
                            Annuler
                        </button>

                        <button value="confirm" className="delete-box__button" onClick={() => handleDeleteComment(props.id)} data-commentid={props.id}>
                            Confirmer
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
