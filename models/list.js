const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const listScheme = new Schema({
    list: {
        type: Types.ObjectId,
        ref: 'Element',
        required: true
    },
    type: {
        type: Types.ObjectId,
        ref: 'ListType',
        required: true
    },
    secretKey: {
        type: Types.ObjectId,
        ref: 'SecretKey',
        required: true
    },
})

module.exports = mongoose.model("List", listScheme)