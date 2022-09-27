import { useState } from 'react';

//On importe la fonction permettant de récupérer les données envoyées côté serveur, et permettant
//d'afficher les messages si une erreur se produit pendant l'envoi du formulaire d'inscription
import { Signup } from './User';

import "./RegisterLoginComponent.css";

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
    
    //On définit une variable toggle, pour
    const { toggle } = props;

    function handleChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...registerData, [name]: value });
        setServerResponse("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await Signup(registerData);
        if (response.status) {
            setUserInfo({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
            });
            setServerResponse(response.message);
            setTimeout(() => {
                toggle();
            }, 2000);
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
