import { useState } from 'react';

import RegisterComponent from '../components/User/RegisterComponent';
import LoginComponent from '../components/User/LoginComponent';

import "./LoginRegister.css";


//On définit la fonction qui retourne notre page de connexion, avec un toggle pour passer à l'inscription
export default function LoginRegister() {
    const [mode, setMode] = useState("Connexion");
    const toggle = () => {
        setMode(mode === "Connexion" ? "Inscription" : "Connexion");
    };

    return (
        <div className="signup-login-wrapper">
            {mode === "Connexion" ? (
                <LoginComponent className="card" />
            ) : (
                <RegisterComponent className="card" toggle={toggle} />
            )}
            <p className="signup-login-message">
                <button onClick={toggle} className="link-button">
                    {mode === "Connexion"
                        ? "Créer un compte"
                        : "Se connecter"}
                </button>
            </p>
        </div>
    );
}
