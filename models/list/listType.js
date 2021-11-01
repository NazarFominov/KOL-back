const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const listTypeScheme = new Schema({
    type: {
        type: Types.String,
        maxLength: 30
    },
    name: {
        type: Types.String,
        maxLength: 50
    },
    isSelectable: {
        type: Types.Bool,
        default: false,
    }
})

module.exports = mongoose.model("ListType", listTypeScheme)