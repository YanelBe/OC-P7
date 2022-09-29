import React from "react";

import "./PageNotFound.css"

//On créé une fonction pour l'affichage d'une page d'erreur si une page demandée n'existe pas
const PageNotFound = () => {
  return (
    <div className="page-not-found">404 - Page non trouvée !</div>
  );
};

export default PageNotFound;