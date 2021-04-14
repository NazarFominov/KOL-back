const express = require("express")
const path = require("path");
const bodyParser = require("body-parser")
const albumController = require("controllers/albumController")
const albumsMusicController = require("controllers/albumsMusicController")

const albumRouter = express.Router();

const urlencodedParser = bodyParser.urlencoded({extended: false});

albumRouter.put("/:id/musics/add", express.json(), albumsMusicController.addMusicsInAlbum)
albumRouter.get("/:id/musics/ids", albumsMusicController.getMusicsIds)
albumRouter.get("/:id/musics", albumsMusicController.getMusics)
albumRouter.delete("/:id/delete", urlencodedParser, albumController.deleteAlbum)
albumRouter.get("/:id/cover", urlencodedParser, albumController.getAlbumCover)
albumRouter.get("/:id", urlencodedParser, albumController.getAlbum)


module.exports = albumRouter