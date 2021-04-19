const Element = require("models/element")
const ListType = require("models/list/listType")
const ElementType = require("models/elementType")
const List = require("models/list/list")
const url = require('url');
const mongoose = require('mongoose')
const {Types} = mongoose.Schema;

async function getParentsChain(children, chain = []) {
    if (children.parent === null) return chain;
    else {
        const element = await Element.findById(children.parent)
        return element ? getParentsChain(element, [...chain, {name: element.name, id: element.id}]) : []
    }
}

async function populateElements(elements) {
    elements = await Element.populate(elements, [{path: 'type'}])
    let lists = await List.find({
        list: {
            $in: elements
                .filter(e => e.type.type === 'list')
                .map(e => e._id)
        }
    }).exec()
    lists = await List.populate(lists, [{path: 'type'}])
    elements = elements
        .map(e => ({
            id: e._id,
            parent: e._doc.parent,
            description: e._doc.description,
            name: e._doc.name,
            timeOfCreation: e._doc.timeOfCreation,
            timeOfEditing: e._doc.timeOfEditing,
            isFavorite: e._doc.isFavorite,
            type: (() => {
                const {type} = e._doc;
                return {
                    name: type.name,
                    type: type.type,
                    id: type._id
                }
            })(),
            listType: (() => {
                const list = lists.find(l => l.list.toString() === e._id.toString());
                return list ? {
                    name: list.type.name,
                    type: list.type.type,
                    id: list.type._id
                } : null
            })(),
        }))
        .sort((a, b) => a.timeOfCreation < b.timeOfCreation ? 1 : -1)
        .sort((a, b) => a.type.type > b.type.type ? 1 : -1)

    return elements;
}

exports.getElements = async function (req, res) {
    try {
        let elements = await Element.find({$and: [{secretKey: req.secretKeyId}, {parent: req.query.parentId || null}]}).exec()
        elements = await populateElements(elements);

        let parentsChain = await getParentsChain(elements[0] || {parent: req.query.parentId});
        parentsChain.push({name: "Главная", id: null});
        parentsChain = parentsChain.reverse();

        res.status(200);
        res.end(JSON.stringify({elements, parentsChain}))
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

exports.getFavorites = async function (req, res) {
    try {
        let elements = await Element.find({$and: [{secretKey: req.secretKeyId}, {isFavorite: true}]}, "name type").exec()
        elements = await populateElements(elements);

        res.status(200);
        res.end(JSON.stringify({elements}))
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

exports.searchElements = async function (req, res) {
    try {
        const {nameString} = req.query;
        const reg = new RegExp(nameString, 'i')
        let elements = await Element.find({$and: [{secretKey: req.secretKeyId}, {name: reg}]}).exec()
        elements = await Element.populate(elements, [{path: 'type'}])
        let lists = await List.find({
            list: {
                $in: elements
                    .filter(e => e.type.type === 'list')
                    .map(e => e._id)
            }
        }).exec()
        lists = await List.populate(lists, [{path: 'type'}])
        elements = elements.map(e => ({
            id: e._id,
            parent: e._doc.parent,
            description: e._doc.description,
            name: e._doc.name,
            timeOfCreation: e._doc.timeOfCreation,
            timeOfEditing: e._doc.timeOfEditing,
            isFavorite: e._doc.isFavorite,
            type: (() => {
                const {type} = e._doc;
                return {
                    name: type.name,
                    type: type.type,
                    id: type._id
                }
            })(),
            listType: (() => {
                const list = lists.find(l => l.list.toString() === e._id.toString());
                return list ? {
                    name: list.type.name,
                    type: list.type.type,
                    id: list.type._id
                } : null
            })(),
        }))
            .sort((a, b) => a.timeOfCreation < b.timeOfCreation ? 1 : -1)
            .sort((a, b) => a.type.type > b.type.type ? 1 : -1)

        res.status(200);
        res.end(JSON.stringify({elements}))
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

exports.getFolders = async function (req, res) {
    try {
        const type = await ElementType.findOne({type: 'folder'}).exec();
        let folders = await Element.find({$and: [{secretKey: req.secretKeyId}, {type: type._id}]}, 'name description parent').exec()
        const {excludeChildrenOfIds} = req.query;
        if (excludeChildrenOfIds && folders.length) {
            const idsForVerification = typeof excludeChildrenOfIds === 'string' ? [excludeChildrenOfIds] : excludeChildrenOfIds;
            const foundIds = [];
            let remainingFolders = folders;
            while (idsForVerification.length) {
                remainingFolders = remainingFolders.filter(f => !foundIds.includes(f._id ? f._id.toString() : f._id))
                const searchIds = remainingFolders.filter(f => f.parent ? f.parent.toString() === idsForVerification[0].toString() : f.parent);
                idsForVerification.splice(0, 1);
                foundIds.splice(foundIds.length, 0, ...searchIds.map(s => s._id.toString()));
                idsForVerification.splice(idsForVerification.length, 0, ...searchIds.map(s => s._id.toString()));
            }

            folders = folders.filter(f => !foundIds.includes(f.id))
        }

        folders = folders
            .map(f => ({
                id: f._id,
                description: f._doc.description,
                name: f._doc.name,
            }))
            .sort((a, b) => a.name < b.name ? 1 : -1)

        res.status(200);
        res.end(JSON.stringify(folders))
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}