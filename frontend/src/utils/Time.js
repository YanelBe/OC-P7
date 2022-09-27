//Fonction pour formatter le temps de la création de post ou commentaire
export default function formatTime(timestamp) {
    
    const timestampObj = new Date(timestamp);

    let minutes = timestampObj.getMinutes();
    let hours = timestampObj.getHours();
    let day = timestampObj.getDate();
    let month = timestampObj.getMonth() + 1;
    let year = timestampObj.getFullYear();

    
    if (minutes < 10) {
        minutes = minutes.toString().concat(0).split("").reverse().join("");
    }

    if (hours < 10) {
        hours = hours.toString().concat(0).split("").reverse().join("");
    }

    if (day < 10) {
        day = day.toString().concat(0).split("").reverse().join("");
    }
    
    if (month < 10) {
        month = month.toString().concat(0).split("").reverse().join("");
    }
    
    if (timestamp === null) return null;

    return `${day}/${month}/${year} à ${hours}h${minutes}`;
}
