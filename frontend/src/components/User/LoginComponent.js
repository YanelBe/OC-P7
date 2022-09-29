import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { Login } from './User';

import "./RegisterLogin.css";

//On exporte notre fonction pour gérer l'affichage du formulaire de connexion
export default function LoginComponent() {

    //On importe notre contexte d'authentification
    const { handleLogin } = useContext(AuthContext);

    //On utilise useState() pour observer l'état du formulaire de connexion
    const [userLoginInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    //On définit un state pour l'affichage d'un message
    const [customMessage, setCustomMessage] = useState("");

    //On utilise le hook useNavigate() pour la redirection
    const navigate = useNavigate();

    //On définit une constante useLocation() pour définir notre localisation actuelle
    const location = useLocation();

    //On définit une variable pour la location vers laquelle on se naviguera après la connexion
    const origin = location.state?.from?.pathname || "/home";

    //On utilise la fonction handleChange() pour capter les entrées écrites dans le formulaire
    function handleChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userLoginInfo, [name]: value });
    }

    //Fonction pour gérer l'envoi des données de l'utilisateur
    async function handleSubmit(event) {
        event.preventDefault();
        //On attend l'envoi des données
        const response = await Login(userLoginInfo);
        if (response.status) {
            await handleLogin(response.token);
            //On navigue vers la page d'accueil
            navigate(origin);
        //Si quelque chose ne va pas, on définit un message personnalisé avec les raisons du refus de connexion
        } else setCustomMessage(response);
    }




    return (
        <div className="card-signinup">
            <form onSubmit={(event) => handleSubmit(event)}>
                
                <input type="email" name="email" id="email" placeholder="E-mail" value={userLoginInfo.email} maxLength={200} required
                    onChange={(event) => handleChange(event)}/>
                
                <input type="password" name="password" id="password" placeholder="Mot de passe" value={userLoginInfo.password} maxLength={200}
                    required onChange={(event) => handleChange(event)}/>

                <button type="submit">Connexion</button>
            </form>

            <p>{customMessage}</p>
        </div>
    );
}