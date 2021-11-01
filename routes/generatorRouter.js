const express = require("express")
const generatorController = require("controllers/generatorController")

const generatorRouter = express.Router();

generatorRouter.get("/menu", generatorController.getMenu)
generatorRouter.get("/recipe", generatorController.getRecipe)

module.exports = generatorRouter