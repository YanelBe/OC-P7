import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';

import Comment from '../Comments/CommentComponent';
import TextBloc from '../TextBloc';

import { LikePost } from './PostCRUD';
import { GetAllComments, DeleteComment } from '../Comments/CommentCRUD';

import formatTime from '../../../utils/Time';

import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";

import "./Post.css";

//Fonction pour gérer les posts
export default function Post(props) {
    const { handleDeletePost, refreshPost } = props;
    const [comments, setComments] = useState([]);
    const { token, userId, admin } = useContext(AuthContext);

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
    
    //State pour le menu qui sert à modifier ou supprimer un post
    const [isPostMenuVisible, setIsPostMenuVisible] = useState(false);

    //Fonction pour afficher le menu qui sert à modifier ou supprimer un post
    function showPostMenu() {
        setIsPostMenuVisible(!isPostMenuVisible);
    }

    //State pour éditer un post
    const [postEditMode, setPostEditMode] = useState(false);
    const [commentPublishMode, setcommentPublishMode] = useState(false);

    const navigate = useNavigate();

    //Variable pour activer l'édit d'un post
    const togglePostEditMode = (evt) => {
        if (evt) evt.preventDefault();
        setPostEditMode(!postEditMode);
    };

    //Variable pour activer l'édit d'un commentaire sur un post
    const toggleCommentPublishMode = (evt) => {
        if (evt) evt.preventDefault();
        setcommentPublishMode(!commentPublishMode);
    };

    //Variable pour récupérer la confirmation de suppression d'un post
    const deletePostModal = document.getElementById(
        `deletePostModal-${props.id}`
    );
    
    //Fonction qui affiche la modal de suppression de post
    function showDeletePostModal() {
        deletePostModal.showModal();
    }
    
    //On créé une variable pour formater le temps
    const creationTime = formatTime(props.createdTime);
    
    //useEffect qui fait appel à la fonction FetchComments pour récupérer les commentaires du post
    useEffect(() => {
        async function FetchComments() {
            const response = await GetAllComments(props.id, token);
            if (response.status) {
                if (response.status === 401) navigate('/');
                else setComments(response.comments);
            } else console.log(response);
        }
        FetchComments();
    }, [navigate, props.id, token]);


    //Fonction pour insérer un nouveau commentaire
    async function insertComment(newComment) {
        setComments((comments) => [...comments, newComment]);
    }

    //Fonction pour refresh la liste des commentaires
    async function refreshComment(commentId, newComment) {
        setComments(
            comments.map((comment) => {
                if (comment._id !== commentId) return comment;
                else return newComment;
            })
        );
    }

    //Fonction pour gérer la suppression de commentaire
    async function handleDeleteComment(commentId) {
        const response = await DeleteComment(commentId, token);
        if (response.status) {
            if (response.status === 401) navigate('/');
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
                                    <div className="comment-box__actions-menu">
                                        <button className="comment-box__modify-button" title="Modifier ce post" onClick={togglePostEditMode}>
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
                                <div className="delete-box__button-div">
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
                    <img
                        src={props.imageUrl}
                        alt=""
                        className="post-box_picture"
                    />
                )}
                <div className="post-box__like-comment">
                    <button
                        className="post-box__like-comment__comment-button"
                        onClick={toggleCommentPublishMode}>
                        <span>Répondre à cette publication</span>
                    </button>

                    {commentPublishMode && (
                        <TextBloc
                            postId={props.id}
                            toggleCommentPublishMode={toggleCommentPublishMode}
                            insertComment={insertComment}
                            contentType="createComment"/>)}

                    <button
                        className="post-box__like-comment__like-button"
                        onClick={() => handleLike(props.id)}>
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
