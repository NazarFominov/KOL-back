const express = require("express")
const generatorController = require("controllers/generatorController")

const generatorRouter = express.Router();

generatorRouter.get("/menu", generatorController.getMenu)

module.exports = generatorRouter