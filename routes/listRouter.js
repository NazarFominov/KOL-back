const express = require("express")
const listController = require("controllers/listController")
const bodyParser = require("body-parser")

const listRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

listRouter.put("/note", express.json(), listController.editNote)
listRouter.get("/note", listController.getNote)
listRouter.post("/:elementId/recipe", express.json(), listController.editRecipe)
listRouter.delete("/:elementId/recipe/:recipeId", urlencodedParser, listController.deleteRecipe)
listRouter.get("/recipes", listController.getRecipes)

module.exports = listRouter