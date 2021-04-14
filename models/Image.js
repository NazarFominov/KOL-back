const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const imageScheme = new Schema({
    path: {
        type: Types.String,
        required: true
    }
})

module.exports = mongoose.model("Image", imageScheme)