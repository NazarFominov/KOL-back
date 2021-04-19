const express = require("express")
const bodyParser = require("body-parser")
const typesController = require("controllers/typesController")

const typesRouter = express.Router();

const urlencodedParser = bodyParser.urlencoded({extended: false});

typesRouter.get("/types", urlencodedParser, typesController.getRecipeTypes)
typesRouter.post("/type", express.json(), typesController.addRecipeType)
typesRouter.get("/categories", urlencodedParser, typesController.getRecipeCategories)
typesRouter.post("/category", express.json(), typesController.addRecipeCategory)
typesRouter.get("/ingredients", urlencodedParser, typesController.getRecipeIngredients)
typesRouter.post("/ingredient", express.json(), typesController.addRecipeIngredient)

module.exports = typesRouter