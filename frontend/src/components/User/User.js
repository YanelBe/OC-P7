//Série de fonctions asynchrones pour gérer les informations de compte et de connexion
//entre le back et le front, en affichant des messages dans le front selon la réponse du serveur

//Fonction pour gérer la création de compte
export async function Signup(registerData) {
    try {
        //On attend de recevoir les informations envoyées par l'utilisateur pour l'enregistrement
        const response = await fetch("http://localhost:3000/api/user/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //On envoie les informations en JSON
            body: JSON.stringify(registerData),
        });
        //Si on a une réponse 201 (requête réussie et contenu créé), on peut se connecter
        if (response.status === 201) {
            return {
                status: response.status,
                message: "Votre compte a été créé ! Vous pouvez vous connecter dès maintenant !"
            };
        //Si on obtient une réponse 400
        } else if (response.status === 400) {
            const data = await response.json();
            //Si la réponse 400 est due à un mot de passe invalide, on retourne les spécifications du mot de passe
            if (data.message === "Le mot de passe est invalide !") {
                return "Votre mot de passe doit contenir au moins 8 caractères, dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
            //Si la réponse 400 est due à un format d'adresse email invalide, on le précise
            } else if (data.message === "Le format de l'adresse email est incorrect !") {
                return "Le format de l'adresse email est incorrect !";
            //Pour tout autre erreur, on renvoie un autre message
            } else
                return "Veuillez bien remplir le formulaire !";
        } else if (response.status === 409) {
            return "Cette adresse email est déjà utilisée !"
        } else return "Une erreur est survenue. Veuillez réessayer.";
    } catch (error) {return error}
};

//Fonction pour gérer la connexion au compte
export async function Login(userLoginInfo) {
    try {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userLoginInfo),
        });
        if (response.status === 200) {
            const data = await response.json();
            return { status: response.status, token: data.token };
        } else if (response.status === 401 || response.status === 404 || response.status === 500) {
            return "L'adresse email ou le mot de passe est invalide !";
        } else return "Une erreur est survenue. Veuillez réessayer.";
    } catch (error) { return error }
};