import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

//On importe notre contexte d'authentification
import { AuthContext } from '../context/AuthContext';

//On importe le logo et une icône react pour la déconnexion
import { IoMdLogOut } from "react-icons/io";
import headerLogoRed from '../assets/icon-left-font-resized.png';

//On importe notre feuille de style
import "./Header.css";

//On exporte notre fonction pour afficher le header
export default function Header() {
    //On utilise notre contexte d'authentification pour pouvoir gérer la déconnexion
    const { handleLogout, token } = useContext(AuthContext);

    return (
        <header id="header">
            <NavLink to="/home">
                <img className="header-logo" src={headerLogoRed} alt="Logo Groupomania"/>
            </NavLink>

            {/*Si le token existe bien (et qu'on est connecté), on gère l'affichage du bouton de déconnexion*/}
            {token !== null && token !== "null" && (
                <nav>
                    <ul className="header-links">
                       <li>
                            <button className="logout-button" onClick={() => handleLogout()}>
                            <span className="logout-button__icon"><IoMdLogOut/></span>
                            <span className="logout-button__text">Se déconnecter</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
