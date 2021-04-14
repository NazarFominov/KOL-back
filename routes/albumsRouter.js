const express = require("express")
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser")
const albumController = require("controllers/albumController")

const albumsRouter = express.Router();

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "content/albumsCovers");
    },
    // filename: (req, file, cb) => {
    //     cb(null, file.originalname);
    // }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/gif" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const albums = multer({storage: storageConfig, fileFilter: fileFilter})
const urlencodedParser = bodyParser.urlencoded({extended: false});

albumsRouter.post("/add", albums.single("cover"), albumController.addAlbum)
albumsRouter.put("/edit", albums.single("cover"), albumController.editAlbum)
albumsRouter.get("/", albumController.getAlbums)


module.exports = albumsRouter