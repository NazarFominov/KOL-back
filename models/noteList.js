const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const noteListScheme = new Schema({
    list: {
        type: Types.ObjectId,
        ref: 'List',
        required: true
    },
    text: {
        type: Types.String,
        maxLength: 1000,
    },
})

module.exports = mongoose.model("NoteList", noteListScheme)