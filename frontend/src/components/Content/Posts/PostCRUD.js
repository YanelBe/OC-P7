//Fonction pour créer un nouveau post
export async function createPost(postContent, token) {
    try {
        let options = {};
        //S'il n'y a pas d'image
        if (postContent.image === null) {
            options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                //On renvoie les données reçues en JSON, le texte du post
                body: JSON.stringify(postContent),
            };
        //S'il y en a une, on formate le texte et l'image dans un constructeur FormData(),
        //qui va se remplir avec les valeurs indiquées
        } else {
            let formData = new FormData();
            formData.append("post", postContent.text);
            formData.append("image", postContent.image);

            options = {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            };
        }
        //On attend de récupérer la liste des posts
        const response = await fetch('http://localhost:3000/api/post', options);

        //Si on les récupère, on y rajoute le nouveau post
        if (response.status === 201) {
            const data = await response.json();
            return { status: response.status, newPost: data.post };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) { 
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
}



//Fonction pour récupérer de nouveaux posts
export async function GetAllPosts(pageNumber, token) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/post?page=${pageNumber}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        //Si la requête a réussi, on affiche les commentaires
        if (response.status === 200) {
            const newPosts = await response.json();
            return { status: response.status, newPosts };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
}



//Fonction pour récupérer un post
export async function GetOnePost(postId, token) {
    try {
        const response = await fetch(`http://localhost:3000/api/post/single/${postId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
            const newPost = await response.json();
            return { status: response.status, newPost };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};



//Fonction pour mettre à jour un post
export async function updatePost(postId, postContent, token) {
    try {
        let options = {};
        //S'il n'y a pas d'image
        if (postContent.image === null) {
            options = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postContent),
            };
        } else {
            //S'il y en a une, on formate le texte et l'image dans un constructeur FormData(),
            //qui va se remplir avec les valeurs indiquées
            let formData = new FormData();
            formData.append("post", postContent.text);
            formData.append("image", postContent.image);

            options = {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            };
        }

        const response = await fetch(`http://localhost:3000/api/post/${postId}`, options);
        //Si la requête a réussi, on met à jour le post
        if (response.status === 200) {
            return { status: response.status };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};

//Fonction pour supprimer un post
export async function DeletePost(postId, token) {
    try {
        const response = await fetch(`http://localhost:3000/api/post/${postId}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        //Si la requête a réussi, on supprime le post
        if (response.status === 200) {
            return { status: response.status };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};

//Fonction pour attribuer un like a un post
export async function LikePost(postId, like, token) {
    try {
        //On vérifie avec une ternaire si un like est déjà attribué ou non, et on l'applique ou on l'enlève selon le cas
        const likeToGive = like === 0 ? 1 : 0;
        const response = await fetch(`http://localhost:3000/api/post/${postId}/like`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ like: likeToGive }),
            }
        );
        //Si le like est bien attribué, on l'applique
        if (response.status === 201) {
            return { status: response.status };
        //Si la requête n'est pas autorisée, on renvoie un message
        } else if (response.status === 401) {
            return { status: response.status };
        //Pour tout autre erreur
        } else return "Une erreur est survenue. Veuillez réessayer."
    } catch (error) {return error}
};
