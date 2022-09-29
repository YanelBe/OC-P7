//Fonction pour créer un nouveau commentaire
export async function createComment(text, postId, token) {
    try {
        //On attend de récupérer les données envoyées pour la création du commentaire
        const response = await fetch('http://localhost:3000/api/comment', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            //On renvoie les données reçues en JSON, le texte du commentaire et l'ID du post sur lequel on commente
            body: JSON.stringify({ text, postId }),
        });
        //Si le commentaire est bien créé, on attend la réponse en JSON et on publie le commentaire
        if (response.status === 201) {
            const data = await response.json();
            return { status: response.status, newComment: data.comment };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer.";
    } catch (error) {return error}
};



//Fonction pour récupérer tous les commentaires
export async function GetAllComments(postId, token) {
    try {
        //On attend de récupérer les données avec l'ID du commentaire à viser
        const response = await fetch(`http://localhost:3000/api/comment/${postId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        //Si la requête a réussi, on affiche les commentaires
        if (response.status === 200) {
            const comments = await response.json();
            return { status: response.status, comments };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};



//Fonction pour mettre à jour les commentaires
export async function updateComment(commentId, text, token) {
    try {
        //On attend de récupérer les données avec l'ID du commentaire à viser
        const response = await fetch(`http://localhost:3000/api/comment/${commentId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                //On renvoie les données reçues en JSON, le texte modifié du message
                body: JSON.stringify({ text }),
            }
        );
        //Si le commentaire est bien modifié, on attend la réponse en JSON et on publie le commentaire
        if (response.status === 200) {
            const data = await response.json();
            return { status: response.status, comment: data.comment };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};



//Fonction pour supprimer un commentaire
export async function DeleteComment(commentId, token) {
    try {
        //On attend de récupérer les données avec l'ID du commentaire à viser
        const response = await fetch(
            `http://localhost:3000/api/comment/${commentId}`,
            {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`},
            }
        );
        //Si la requête a réussi, on supprime le commentaire
        if (response.status === 200) {
            return { status: response.status };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) { 
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};