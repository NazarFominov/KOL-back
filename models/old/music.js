const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const musicScheme = new Schema({
    originalName: String,
    artist: String,
    title: String,
    duration: Number,
    path: String
})

module.exports = mongoose.model("Music", musicScheme)