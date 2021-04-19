const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const recipeListScheme = new Schema({
    list: {
        type: Types.ObjectId,
        ref: 'List',
        required: true
    },
    recipes: [{
        type: Types.ObjectId,
        ref: 'Recipe',
        required: true
    }],
})

module.exports = mongoose.model("RecipeList", recipeListScheme)