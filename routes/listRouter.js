const express = require("express")
const listController = require("controllers/listController")
const bodyParser = require("body-parser")

const listRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

listRouter.put("/note", express.json(), listController.editNote)
listRouter.get("/note", listController.getNote)

module.exports = listRouter