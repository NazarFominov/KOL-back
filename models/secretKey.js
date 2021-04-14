const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const secretKeyScheme = new Schema({
    key: {
        type: Types.String,
        required: true
    }
})

 module.exports = mongoose.model("SecretKey", secretKeyScheme)