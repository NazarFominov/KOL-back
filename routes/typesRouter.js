const express = require("express")
const bodyParser = require("body-parser")
const typesController = require("controllers/typesController")

const typesRouter = express.Router();

const urlencodedParser = bodyParser.urlencoded({extended: false});

typesRouter.get("/element", urlencodedParser, typesController.getElementTypes)
typesRouter.get("/list", urlencodedParser, typesController.getListTypes)

module.exports = typesRouter