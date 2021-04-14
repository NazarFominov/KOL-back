const Element = require("models/element")
const List = require("models/list")
const NoteList = require("models/noteList")
const {getOneListById} = require("./generalFunctions");
const {getOneElementById, getOneListByElementId} = require("./generalFunctions");

exports.editNote = async function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {text, id} = req.body;

    if (!id) return res.sendStatus(500);

    try {
        const list = await getOneListByElementId(id, req);
        if (list === null) res.sendStatus(404);

        const note = await NoteList.findOne({list: list._id}).exec()
        if (note === null) {
            await NoteList.create({
                text: text,
                list: list._id
            })

            res.sendStatus(204)
        } else {
            await NoteList.findOneAndUpdate({list: list._id}, {text: text})
            await Element.findByIdAndUpdate(id, {timeOfEditing: new Date()})

            res.sendStatus(204)
        }

    } catch (e) {
        console.log(e)
        return res.sendStatus(500);
    }
}

exports.getNote = async function (req, res) {
    try {
        const {id} = req.query;

        if (!id) return res.sendStatus(500)

        const list = await getOneListByElementId(id, req);
        if (list == null) return res.sendStatus(500)

        const note = await NoteList.findOne({list: list._id})
        if (note === null) {
            res.status(200)
            return res.end(JSON.stringify({text: null}))
        }

        res.status(200)
        res.end(JSON.stringify({id: note._id, text: note.text}))
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.deleteNoteByListId = async function (id) {
    if (!id) return null
    try {
        await NoteList.deleteOne({list: id}, null)
    } catch (e) {
        console.log(e);
        return null
    }
}