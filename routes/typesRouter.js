const express = require("express")
const bodyParser = require("body-parser")
const typesController = require("controllers/typesController")

const typesRouter = express.Router();

const urlencodedParser = bodyParser.urlencoded({extended: false});

typesRouter.get("/element", urlencodedParser, typesController.getElementTypes)
typesRouter.get("/list", urlencodedParser, typesController.getListTypes)
typesRouter.get("/recipe", urlencodedParser, typesController.getRecipeTypes)
typesRouter.post("/recipe", express.json(), typesController.addRecipeType)
typesRouter.get("/category", urlencodedParser, typesController.getRecipeCategories)
typesRouter.post("/category", express.json(), typesController.addRecipeCategory)
typesRouter.get("/ingredient", urlencodedParser, typesController.getRecipeIngredients)
typesRouter.post("/ingredient", express.json(), typesController.addRecipeIngredient)

module.exports = typesRouter