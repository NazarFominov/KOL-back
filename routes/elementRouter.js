const express = require("express")
const elementController = require("controllers/elementController")
const bodyParser = require("body-parser")

const elementRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

elementRouter.post("/", express.json(), elementController.addElement)
elementRouter.put("/", express.json(), elementController.editElement)
elementRouter.put("/parent", express.json(), elementController.changeElementParent)
elementRouter.put("/favorite", express.json(), elementController.setFavorite)
elementRouter.delete("/", elementController.deleteElement)

module.exports = elementRouter