const mongoose = require('mongoose')

const {Schema} = mongoose;
const {Types} = Schema;

const menuListScheme = new Schema({
    list: {
        type: Types.ObjectId,
        ref: 'List',
        required: true
    },
    menu: {
        type: Types.Map,
        of: [[{type: Types.ObjectId, ref: 'Recipe'}]]
    },
})

module.exports = mongoose.model("MenuList", menuListScheme)