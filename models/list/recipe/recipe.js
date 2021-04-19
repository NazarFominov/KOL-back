const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

module.exports = mongoose.model("Recipe", new Schema({
    name: {
        type: Types.String,
        maxLength: 100,
        required: true
    },
    types: [{
        type: Types.ObjectId,
        ref: 'RecipeType',
        required: true
    }],
    categories: [{
        type: Types.ObjectId,
        ref: 'RecipeCategory',
        required: true
    }],
    ingredients: [{
        type: Types.ObjectId,
        ref: 'RecipeIngredient',
        default: [],
    }],
    difficulty: {
        type: Types.Number,
        enum: [1, 2, 3]
    },
    loveLevel: {
        type: Types.Number,
        enum: [1, 2, 3, 4, 5]
    },
    link: {
        type: Types.String,
        maxLength: 200
    },
    note: {
        type: Types.String,
        maxLength: 1000
    },
    timesCook: {
        type: Types.Number,
        default: 0,
    }
}))