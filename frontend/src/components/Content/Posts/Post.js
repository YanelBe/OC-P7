import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";

import Comment from "../Comments/CommentComponent";
import TextBloc from "../TextBloc";

import { LikePost } from "./PostCRUD";
import { GetAllComments, DeleteComment } from "../Comments/CommentCRUD";

import formatTime from "../../../utils/Time";

import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

import "./Post.css";

//Fonction pour gérer les posts
export default function Post(props) {

    
    //On importe le contexte d'authentification
    const { token, userId, admin } = useContext(AuthContext);

    //On créé une variable pour faire appel à notre fonction pour formatter la date de création de post
    const creationTime = formatTime(props.createdTime);

    //On utilise useNavigate pour la redirection de page
    const navigate = useNavigate();




    //--------------------Likes--------------------

    //State pour les likes
    const [like, setLike] = useState(
        props.likeUserIds.includes(`${userId}`) ? 1 : 0
    );

    //Variable pour le toggle d'ajout de like
    const toggleLike = () => {
        setLike(like === 0 ? 1 : 0);
    };

    //Fonction pour ajouter un like et l'afficher juste après
    async function handleLike(postId) {
        const response = await LikePost(postId, like, token);
        if (response.status) {
            if (response.status === 401) navigate('/');
            else {
                toggleLike();
                refreshPost(postId);
            }
        } else console.log(response);
    }




    //--------------------Affichage du menu Post (modifier, supprimer)--------------------

    //State pour le menu qui sert à modifier ou supprimer un post
    const [isPostMenuVisible, setIsPostMenuVisible] = useState(false);

    //Fonction pour afficher le menu qui sert à modifier ou supprimer un post
    function showPostMenu() {
        setIsPostMenuVisible(!isPostMenuVisible);
    }

    //On définit un hook useRef() qui va nous permettre de gérer le collapse du menu Post lors d'un clic sur la page
    const ref = useRef();

    useEffect(() => {
        //On créé une fonction pour écouter le mousedown
        const checkIfClickedOutside = event => {
            //Si le menu est visible, que la propriété current de useRef() existe (elle définit une valeur modifiable),
            //et que la propriété de current ne contient pas la cible de notre event, on cache le menu du post
            if(isPostMenuVisible && ref.current && !ref.current.contains(event.target)) {
                setIsPostMenuVisible(false)
            }
        }
        //On écoute l'évènement mousedown, qui s'active dès le clic de la souris (et non pas au relachement du click
        //comme pour "click"). On y applique notre fonction
        document.addEventListener("mousedown", checkIfClickedOutside);

        //Une fois le mousedown effectué, on enlève l'écoute pour que la fonction ne s'active pas à chaque mousedown
        return() => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    //Notre dépendance est l'affichage du menu
    }, [isPostMenuVisible])
    



    //--------------------Affichage pour éditer un post--------------------

    //State pour éditer un post
    const [postEditMode, setPostEditMode] = useState(false);


    //Variable pour activer l'édit d'un post
    const togglePostEditMode = (event) => {
        if (event) 
            event.preventDefault();
        setPostEditMode(!postEditMode);
    };

    //Variable pour activer l'édit d'un commentaire sur un post
    const toggleCommentPublishMode = (event) => {
        if (event) 
            event.preventDefault();
        setcommentPublishMode(!commentPublishMode);
    };
    



    //--------------------Affichage pour supprimer un post--------------------

    //Variable pour récupérer la confirmation de suppression d'un post
    const deletePostModal = document.getElementById(`deletePostModal-${props.id}`);
    
    //Fonction qui affiche la modal de suppression de post
    function showDeletePostModal() {
        deletePostModal.showModal();
    }
    
    //Pour la suppression, on fait appel aux props de l'élément parent, la page Home, où est définie
    //la fonction pour supprimer un post, et refresh la liste des posts juste après
    const { handleDeletePost, refreshPost } = props;




    //--------------------AFfichage des commentaires--------------------

    //State pour l'affichage des commentaires
    const [comments, setComments] = useState([]);
    
    const [commentPublishMode, setcommentPublishMode] = useState(false);
    
    //useEffect qui fait appel à la fonction FetchComments pour récupérer les commentaires du post
    useEffect(() => {
        async function FetchComments() {
            //On attend la fonction récupérant tous les commentaires
            const response = await GetAllComments(props.id, token);
            if (response.status) {
                //Si la requête n'est pas autorisée, on redirige vers la page de connexion
                if (response.status === 401) 
                    navigate("/");
                //Sinon, on applique les commentaires au post
                else 
                    setComments(response.comments);
            } else 
                console.log(response);
        }
        FetchComments();
    //Nos dépendances contiennent navigate pour rediriger, l'id du post, et le token
    }, [navigate, props.id, token]);


    //Fonction pour insérer un nouveau commentaire
    async function insertComment(newComment) {
        setComments((comments) => [...comments, newComment]);
    }

    //Fonction pour refresh la liste des commentaires
    async function refreshComment(commentId, newComment) {
        setComments(
            comments.map((comment) => {
                if (comment._id !== commentId) 
                    return comment;
                else 
                    return newComment;
            })
        );
    }

    //Fonction pour gérer la suppression de commentaire
    async function handleDeleteComment(commentId) {
        const response = await DeleteComment(commentId, token);
        if (response.status) {
            if (response.status === 401) navigate("/");
            else
                setComments(
                    comments.filter((comment) => comment._id !== commentId)
                );
        } else console.log(response);
    }
    


    
    return (
        <article className="post-box">
            <div className="post-box__content">
                <div className="post-box__name-text">
                    <div className="post-box__name-text__name-edit">
                        <div>
                            <p className="post-box__name-text__name">
                                {`${props.author.firstName} ${props.author.lastName}`}
                            </p>
                            <p className="post-box__create-time">
                                {creationTime}
                            </p>
                        </div>

                        {(admin === true || admin === 'true' || userId === props.author._id) && (
                            <div className="comment-box__actions" onClick={() => showPostMenu()}>
                                <button className="comment-box__menu_opener"><BsThreeDotsVertical/></button>
                                {isPostMenuVisible && (
                                    <div className="comment-box__actions-menu" ref={ref}>
                                        <button className="comment-box__modify-button" title="Modifier ce post" onClick={() => togglePostEditMode()}>
                                            Modifier
                                        </button>
                                        <button className="comment-box__delete-button" title="Supprimer ce post" onClick={() => showDeletePostModal()}>
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                                {postEditMode ? (
                                    <TextBloc
                                        id={props.id}
                                        text={props.text}
                                        imageUrl={props.imageUrl}
                                        refreshPost={refreshPost}
                                        togglePostEditMode={togglePostEditMode}
                                        contentType="editPost"/>
                                ) : ""}
                            </div>
                        )}
                        <dialog className="delete-box" id={`deletePostModal-${props.id}`}>
                            <form method="dialog">
                                <p>Souhaitez-vous réellement supprimer ce message ?</p>
                                <div className="delete-box__button-div" >
                                    <button value="cancel" className="delete-box__button" autoFocus>
                                        Annuler
                                    </button>
                                    <button value="confirm" className="delete-box__button" onClick={() => handleDeletePost(props.id)}>
                                        Confirmer
                                    </button>
                                </div>
                            </form>
                        </dialog>

                        
                        
                    </div>
                    <p className="post-box__text">{props.text}</p>
                </div>

                {props.imageUrl !== '' && (
                    <img src={props.imageUrl} alt="" className="post-box_picture"/>
                )}
                
                <div className="post-box__like-comment">
                    <button className="post-box__like-comment__comment-button" onClick={toggleCommentPublishMode}>
                        <span>Répondre à cette publication</span>
                    </button>

                    {commentPublishMode && (
                        <TextBloc
                            postId={props.id}
                            toggleCommentPublishMode={toggleCommentPublishMode}
                            insertComment={insertComment}
                            contentType="createComment"/>)}

                    <button className="post-box__like-comment__like-button" onClick={() => handleLike(props.id)}>
                        <span>
                            {props.likesValue > 0 && props.likesValue}
                        </span>

                        {like === 0 ? (
                            <AiOutlineLike/>
                        ) : (
                            <AiFillLike/>
                        )}

                    </button>
                    
                </div>
                <div className="post-box__comments">
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            id={comment._id}
                            author={comment.userId}
                            text={comment.text}
                            createdTime={comment.createdTime}
                            refreshComment={refreshComment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    ))}
                </div>
            </div>
        </article>
    );
}
