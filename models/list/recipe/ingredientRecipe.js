const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

exports.RecipeIngredient = mongoose.model("RecipeIngredient", new Schema({
        type: {
            type: Types.String,
            maxLength: 30
        },
        name: {
            type: Types.String,
            maxLength: 50
        }
    })
)