import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

//On importe notre contexte d'Authentification
import { AuthContext } from "../context/AuthContext";

//On créé une variable Protected, qui va servir de route protégée afin
//que seuls les utilisateurs autorisés puissent accéder au contenu du site
const Protected = ({ children }) => {
    //On utilise notre contexte d'authentification
    const { token } = useContext(AuthContext);
    const location = useLocation();

    //Si le token n'est pas présent, on redirige vers la page de connexion/création de compte
    if (token === null || token === "null")
        return <Navigate to="/" replace state={{ from: location }} />;

    return children;
}

export default Protected;