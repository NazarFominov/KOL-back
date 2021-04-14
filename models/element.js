const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const elementScheme = new Schema({
    parent: {
        type: Types.ObjectId,
        ref: 'Element',
        default: null
    },
    type: {
        type: Types.ObjectId,
        ref: 'ElementType',
        required: true
    },
    name: {
        type: Types.String,
        default: "Без имени",
        maxLength: 30
    },
    description: {
        type: Types.String,
        default: "Без описания",
        maxLength: 350
    },
    image: {
        type: Types.ObjectId,
        ref: 'Image',
        default: null
    },
    secretKey: {
        type: Types.ObjectId,
        ref: 'SecretKey',
        required: true
    },
    timeOfCreation: {
        type: Types.Date,
        default: new Date()
    },
    timeOfEditing: {
        type: Types.Date,
        default: new Date()
    },
    isFavorite: {
        type: Types.Bool,
        default: false,
    }
})

module.exports = mongoose.model("Element", elementScheme)