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
    }
})

module.exports = mongoose.model("ListType", listTypeScheme)