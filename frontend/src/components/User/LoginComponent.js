import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { Login } from './User';

import "./RegisterLogin.css";

//On exporte notre fonction pour gérer l'affichage du formulaire de connexion
export default function LoginComponent() {
    const [userLoginInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const { handleLogin } = useContext(AuthContext);

    const [customMessage, setCustomMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const origin = location.state?.from?.pathname || '/home';

    function handleChange(event) {
        const { name, value } = event.target;
        setUserInfo({ ...userLoginInfo, [name]: value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await Login(userLoginInfo);
        if (response.status) {
            await handleLogin(response.token);
            navigate(origin);
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