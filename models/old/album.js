const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const albumScheme = new Schema({
    title: String,
    pathToCover : String
})

module.exports = mongoose.model("Album", albumScheme)