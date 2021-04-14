const express = require("express")
const elementsController = require("controllers/elementsController")

const elementsRouter = express.Router();

elementsRouter.get("/", elementsController.getElements)
elementsRouter.get("/search", elementsController.searchElements)
elementsRouter.get("/favorites", elementsController.getFavorites)
elementsRouter.get("/folders", elementsController.getFolders)

module.exports = elementsRouter