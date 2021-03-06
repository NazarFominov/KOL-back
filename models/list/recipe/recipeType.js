const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

exports.RecipeType = mongoose.model("RecipeType", new Schema({
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