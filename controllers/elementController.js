const Element = require("models/element")
const List = require("models/list")
const {addAlbum, deleteAlbum} = require("controllers/albumsMusicController")
const path = require("path")
const fs = require("fs")
const gm = require("gm")
const resize = require('resize-img')
const {getOneElementById} = require("./generalFunctions");
const listController = require("./listController");

exports.addElement = function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {body} = req;
    console.log(body)
    Element.create({
        parent: body.parentId,
        type: body.typeId,
        name: body.name || "Без имени",
        description: body.description || "Без описания",
        secretKey: req.secretKeyId,
        timeOfEditing: new Date(),
        timeOfCreation: new Date(),
    }, function (err, element) {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        } else {
            Element.populate(element, [{path: 'type', model: 'ElementType'}], function (err, element) {
                if (err) return res.sendStatus(400);
                if (element.type.type === 'list') {
                    List.create({
                            list: element.id,
                            type: body.listTypeId,
                            secretKey: req.secretKeyId
                        }, function (err) {
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500)
                            }
                            res.sendStatus(204)
                            console.log(element)
                        }
                    )
                } else {
                    res.sendStatus(204)
                    console.log(element)
                }
            })
        }
    })
}

exports.editElement = async function (req, res) {
    try {
        if (!req.body && !req.body.id) return res.sendStatus(500);

        const {body} = req;
        const {id} = body

        const element = {
            name: body.name || 'Без имени',
            description: body.description || 'Без описания',
            timeOfEditing: new Date(),
        }
        const elementHas = getOneElementById(id, req)
        if (elementHas !== null) {
            Element.findByIdAndUpdate(id, element, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                } else res.sendStatus(204)
            });
        } else res.sendStatus(500)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.setFavorite = async function (req, res) {
    try {
        if (!req.body && !req.body.id) return res.sendStatus(500);

        const {body} = req;
        const {id, isFavorite} = body

        const elementHas = getOneElementById(id, req)
        if (elementHas !== null) {
            Element.findByIdAndUpdate(id, {isFavorite}, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                } else res.sendStatus(204)
            });
        } else res.sendStatus(500)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.changeElementParent = async function (req, res) {
    try {
        if (!req.body && !req.body.id) return res.sendStatus(500);

        const {body} = req;
        const {id, parentId} = body

        const element = {
            parent: parentId,
            timeOfEditing: new Date(),
        }
        const elementHas = getOneElementById(id, req)
        if (elementHas !== null) {
            Element.findByIdAndUpdate(id, element, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                } else res.sendStatus(204)
            });
        } else res.sendStatus(500)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.deleteElement = async function (req, res) {
    const {id} = req.query;

    if (!id) return res.sendStatus(500)
    try {
        const children = await Element.findOne({$and: [{secretKey: req.secretKeyId}, {parent: id}]})
        if (children === null) {
            let element = await Element.findOne({$and: [{secretKey: req.secretKeyId}, {_id: id}]})
            console.log(element)
            if (element !== null) {
                element = await Element.populate(element, [{path: 'type', model: 'ElementType'}])
                await Element.findByIdAndDelete(id)
                if (element.type.type === 'list') {
                    List.findOneAndDelete({list: id}, null, async function (err, result) {
                        if (err) return res.sendStatus(500)
                        const list = await Element.populate(result, [{path: 'type', model: 'ListType'}])
                        switch (list.type.type) {
                            case 'notes':
                                await listController.deleteNoteByListId(list._id)
                                break;
                        }
                        return res.sendStatus(204)
                    })
                } else {
                    return res.sendStatus(204)
                }
            } else {
                res.sendStatus(500)
            }
        } else {
            res.status(500);
            res.end(JSON.stringify({message: 'Сперва удалите вложенные элементы!'}))
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
}