const config = require("config")
const express = require("express")
const mongoose = require("mongoose");
const passport = require("passport");

const morgan = require("morgan");
const cors = require('cors')

const albumRouter = require("routes/albumRouter")
const typesRouter = require("routes/typesRouter")
const elementsRouter = require("routes/elementsRouter")
const elementRouter = require("routes/elementRouter")
const listRouter = require("./routes/listRouter");

const authController = require("controllers/authController")

const app = express();

//**************************************************

//**************************************************

app.use(morgan('combined'));
app.use(cors())

app.use(function (req, res, next) {
    res.setHeader('Content-type', 'application/json')
    next();
});
app.use(authController.checkSecretKey)

app.use("/api/album", albumRouter);
app.use("/api/types", typesRouter);
app.use("/api/elements", elementsRouter);
app.use("/api/element", elementRouter);
app.use("/api/list", listRouter);

app.use(function (req, res, next) {
    res.status(404).end("Not Found")
});


const uri = "mongodb://localhost:27017/koldb";
const options = {useNewUrlParser: true}
mongoose.set('debug', true);
mongoose.connect(uri, options, function (err) {
    if (err) return console.log(err);
    app.listen(config.get("port"), process.env.NODE_HOST || 'localhost', function () {
        console.log("Сервер ожидает подключения на %s:%s...", process.env.NODE_HOST || 'localhost', config.get("port"));
    });
});
