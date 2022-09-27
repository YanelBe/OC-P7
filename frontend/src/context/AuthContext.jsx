import React, { createContext, useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

//On créé un contexte pour l'authentification, pour partager les données de manière
//globale, et éviter d'utiliser des props dans des éléments intermédiaires. Cela permet
//de garder en mémoire le statut d'authentification d'un utilisateur, en utilisant
//ici le localStorage et en important le contexte là où il est nécessaire. Cela nous évite
//également de faire appel au localStorage dans chaque document comme tout est regroupé ici
export const AuthContext = createContext();

//On définit une variable AuthProvider, avec comme props les éléments enfants.
//On pré-charge les informations de l'utilisateur, et on attend d'avoir les réponses
//du localStorage avant de render les éléments enfants
export const AuthProvider = ({ children }) => {
    //On récupère les valeurs du localStorage
    const savedAdmin = localStorage.getItem("admin");
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");

    //Le hook useState() nous permet de vérifier notre état, ici notre état
    //correspond au fait d'être admin ou non, d'avoir un token ou non, et d'avoir
    //un userId ou non. On utilise un ternaire pour vérifier si la valeur correspondante
    //existe dans le localStorage, et si elle n'existe pas, elle est définie comme "null"
    const [admin, setAdmin] = useState(savedAdmin ? savedAdmin : null);
    const [token, setToken] = useState(savedToken ? savedToken : null);
    const [userId, setUserId] = useState(savedUserId ? savedUserId : null);
    
    //On utilise le hook useEffect() pour attribuer des effets, ici attribuer les valeurs au localStorage
    useEffect(() => {
        localStorage.setItem("admin", admin);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
    }, [admin, token, userId]);

    //On gère la requête de connexion, après avoir reçu le token
    const handleLogin = async (token) => {
        //On décode le token avec jwt_decode
        const decodedToken = jwt_decode(token);
        setAdmin(decodedToken.admin);
        setToken(token);
        setUserId(decodedToken.userId);
    };

    //On gère la requête de déconnexion, en supprimant les valeurs de la connexion,
    //et en redirigeant vers la page de connexion
    const handleLogout = async () => {
        setAdmin(null);
        setToken(null);
        setUserId(null);
        redirect("/");
    };

    return (
        <AuthContext.Provider value={{ admin, token, userId, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};



//On créé également un contexte pour la publication de contenu
export const PostPublishContext = createContext();


export const PostPublishProvider = ({ children }) => {
    const [postPublishMode, setPostPublishMode] = useState(false);

    const togglePostPublishMode = () => {
        setPostPublishMode(!postPublishMode);
    };

    return (
        <PostPublishContext.Provider value={{ postPublishMode, togglePostPublishMode }}>
            {children}
        </PostPublishContext.Provider>
        
    );
};