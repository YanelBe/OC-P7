const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/png": "png",
    "image/gif": "gif"
};

const storage = multer.diskStorage({
    //On enregistre notre image dans un dossier "images"
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        //Enlève l"extension du nom d"origine puis ajoute un horodatage 
        const name = file.originalname.split(".")[0].split(" ").join("_");
        //L'extension de type MIME résoud l'extension de fichier appropriée
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + "_" + Date.now() + "." + extension);
    }
});

module.exports = multer({storage: storage}).single("image");