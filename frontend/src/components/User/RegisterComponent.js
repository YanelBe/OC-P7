import { useState } from 'react';

//On importe la fonction permettant de récupérer les données envoyées côté serveur, et permettant
//d'afficher les messages si une erreur se produit pendant l'envoi du formulaire d'inscription
import { Signup } from './User';

import "./RegisterLogin.css";

//On exporte notre fonction pour gérer l'affichage du formulaire de création de compte
export default function RegisterComponent(props) {

    //On utilise le hook useState() pour suivre l'état du formulaire
    const [registerData, setUserInfo] = useState({
        firstName: "",
        lastName:"",
        email: "",
        password: "",
    });

    //On utilise le hook useState pour suivre l'état de la réponse renvoyée, qui sera retranscrite
    //dans un message définit dans une fonction importée de notre fichier User
    const [serverResponse, setServerResponse] = useState("");
    
    //On définit une variable toggle, pour changer entre le login et le register
    const { toggle } = props;

    //On utilise la fonction handleChange() pour capter les entrées écrites dans le formulaire
    function handleChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...registerData, [name]: value });
        setServerResponse("");
    }

    //Fonction pour gérer l'envoi des données de l'utilisateur
    async function handleSubmit(event) {
        event.preventDefault();
        //On attend la réponse de notre fonction Signup
        const response = await Signup(registerData);
        //Si on obtient une réponse positive, on enregistre les informations entrées
        if (response.status) {
            setUserInfo({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
            });
            //On affiche le message de confirmation
            setServerResponse(response.message);
            //On définit une fonction asynchrone setTimeout() pour que la fonction "toggle"
            //se déclenche après 2 secondes pour autoriser la connexion
            setTimeout(() => {
                toggle();
            }, 2000);
        //Sinon, on affiche l'erreur correspondante
        } else setServerResponse(response);
    }




    return (
        <div className="card-signinup">
            <form onSubmit={(event) => handleSubmit(event)}>

                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Nom"
                    value={registerData.lastName}
                    maxLength={50}
                    required
                    onChange={(event) => handleChange(event)}/>

                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Prénom"
                    value={registerData.firstName}
                    maxLength={50}
                    required
                    onChange={(event) => handleChange(event)}/>

                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="E-mail"
                    value={registerData.email}
                    maxLength={200}
                    required
                    onChange={(event) => handleChange(event)}/>

                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Mot de passe"
                    value={registerData.password}
                    minLength={8}
                    maxLength={200}
                    required
                    onChange={(event) => handleChange(event)}/>

                <button type="submit">Inscription</button>

            </form>
            <p>{serverResponse}</p>
        </div>
    );
}
