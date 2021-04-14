const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const albumsMusicScheme = new Schema({
    albumId: {
        type: String,
        required: true
    },
    musicsIds: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("AlbumsMusic", albumsMusicScheme)