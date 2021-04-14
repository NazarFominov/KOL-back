const ElementType = require("models/elementType")
const ListType = require("models/listType")
const path = require("path")

exports.getElementTypes = function (req, res) {
    ElementType.find({})
        .exec(function (err, types) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            types = types.map(t => ({
                id: t._id,
                name: t._doc.name,
                type: t._doc.type
            }))

            res.status(200);
            res.end(JSON.stringify(types))
        });
}

exports.getListTypes = function (req, res) {
    ListType.find({})
        .exec(function (err, types) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            types = types.map(t => ({
                id: t._id,
                name: t._doc.name,
                type: t._doc.type
            })).sort((a, b) => a.name > b.name ? 1 : -1)

            res.status(200);
            res.end(JSON.stringify(types))
        });
}