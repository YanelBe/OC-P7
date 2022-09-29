import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Post from '../components/Content/Posts/Post';
import TextBloc from '../components/Content/TextBloc';

import { AuthContext, PostPublishContext } from '../context/AuthContext';
import { GetAllPosts, GetOnePost, DeletePost } from '../components/Content/Posts/PostCRUD';

import "./Home.css"

//Fonction React pour gérer l'affichage de la page d'accueil
export default function Home() {

    //On récupère le contexte d'authentification
    const { token } = useContext(AuthContext);

    //On récupère le contexte de publication de contenu
    const { postPublishMode } = useContext(PostPublishContext);
    const { togglePostPublishMode } = useContext(PostPublishContext);

    const navigate = useNavigate();
    
    //On utilise le hook useState() pour observer l'état de la page
    const [posts, setPosts] = useState([]);
    
    const getPosts = useState(1);
    
    const getPostsRef = useRef(getPosts);


    //Fonction pour refresh un post
    async function refreshPost(postId) {
        const response = await GetOnePost(postId, token);
        setPosts(
            posts.map((post) => {
                if (post._id !== postId) return post;
                else return response.newPost;
            })
        );
    }

    //Fonction pour gérer la suppression de post
    async function handleDeletePost(postId) {
        //On fait appel à la fonction DeletePost
        const response = await DeletePost(postId, token);
        //Si la requête renvoie une réponse
        if (response.status) {
            //Si la requête n'est pas autorisée, on ramène vers la page de connexion
            if (response.status === 401) navigate("/");
            //Sinon, on recharge la page
            else window.location.reload();
        } else console.log(response);
    }

    //Fonction pour récupérer tous les posts sur la page d'accueil
    async function FetchAllPosts() {
        const response = await GetAllPosts(getPostsRef.current, token);
        if (response.status) {
            if (response.status === 401) navigate("/");
            else {
                setPosts((posts) => [...posts, ...response.newPosts]);
            }
        } else console.log(response);
    }

    //On utilise le hook useEffect pour récupérer les posts
    useEffect(() => {
        FetchAllPosts();
    }, []);


    return (
        <div className="home-container">

            {postPublishMode && <TextBloc contentType="createPost" />}

            <button className="new-post" onClick={togglePostPublishMode}>
                        <span>Nouvelle Publication</span>
            </button>
            {posts.map((post) => (
                <Post
                    key={post._id}
                    id={post._id}
                    author={post.userId}
                    text={post.text}
                    imageUrl={post.imageUrl}
                    likesValue={post.likesValue}
                    likeUserIds={post.likeUserIds}
                    createdTime={post.createdTime}
                    refreshPost={refreshPost}
                    handleDeletePost={handleDeletePost}/>
            ))}
        </div>
    );
}
