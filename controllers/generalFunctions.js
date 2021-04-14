const Element = require("models/element")
const List = require("models/list")

exports.getOneElementById = async function (id, req) {
    return Element.findOne({$and: [{secretKey: req.secretKeyId}, {_id: id}]});
}
exports.getOneListById = async function (id, req) {
    return List.findOne({$and: [{secretKey: req.secretKeyId}, {_id: id}]});
}
exports.getOneListByElementId = async function (id, req) {
    return List.findOne({$and: [{secretKey: req.secretKeyId}, {list: id}]});
}