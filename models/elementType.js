const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const elementTypeScheme = new Schema({
    type: {
        type: Types.String,
        maxLength: 30
    },
    name: {
        type: Types.String,
        maxLength: 30
    }
})

module.exports = mongoose.model("ElementType", elementTypeScheme)