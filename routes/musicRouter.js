const express = require("express")
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser")
const musicController = require("controllers/musicController")

const musicRouter = express.Router();

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "content/musics");
    },
    // filename: (req, file, cb) => {
    //     cb(null, file.originalname);
    // }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "audio/webm" ||
        file.mimetype === "audio/ogg" ||
        file.mimetype === "audio/wav" ||
        file.mimetype === "audio/mpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const musics = multer({storage: storageConfig, fileFilter: fileFilter})
const urlencodedParser = bodyParser.urlencoded({extended: false});

musicRouter.post("/add", musics.single("music"), musicController.addMusic)
musicRouter.put("/edit", urlencodedParser, musicController.editMusic)
musicRouter.delete("/delete", urlencodedParser, musicController.deleteMusic)
musicRouter.get("/one", urlencodedParser, musicController.getOneMusic)
musicRouter.get("/", musicController.getMusics)


module.exports = musicRouter