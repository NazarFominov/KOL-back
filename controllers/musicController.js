const jsMediaTags = require("jsmediatags");
const Music = require("models/old/music")
const albumsMusicController = require("controllers/albumsMusicController")
const multiparty = require("multiparty")
const path = require("path")
const fs = require("fs")

const returnPart = req => new RegExp(`\.{0,1}${req.query.part || ""}\.{0,1}`, "i")

exports.addMusic = function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {body} = req;

    let fileData = req.file;

    if (!fileData) {
        console.log("fileData error");
        res.sendStatus(500)
    } else {
        jsMediaTags.read(fileData.path, {
            onSuccess: function (tag) {
                const {tags} = tag;

                const music = new Music({
                    originalName: fileData.originalname,
                    artist: body.artist || tags.artist || "Unknown",
                    title: body.title || tags.title || "Без имени",
                    duration: body.duration,
                    path: fileData.path
                })

                music.save(function (err) {
                    if (err) return res.sendStatus(500)
                    res.sendStatus(204)
                })
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
                res.sendStatus(500)
            }
        });
    }
}
exports.editMusic = function (req, res) {
    const form = new multiparty.Form();
    form.parse(req, function (err, fields) {
        if (err) res.sendStatus(500)

        const id = fields.id[0];
        const body = {
            artist: fields.artist[0] || "Unknown",
            title: fields.title[0] || "Без имени",
        }

        if (!id) res.sendStatus(500)

        Music.findByIdAndUpdate(id, body, function (err) {
            if (err) res.sendStatus(500)
            else res.sendStatus(204)
        });
    });
}
exports.deleteMusic = function (req, res) {
    const id = req.query.id;

    if (!id) res.sendStatus(500)


    Music.findByIdAndDelete(id, null, function (err, mus) {
        if (err) res.sendStatus(500)
        else {
            albumsMusicController.deleteMusic(id)
            fs.unlink(mus.path, (err) => {
                if (err) res.sendStatus(500, "Error delete")
                else res.sendStatus(204)
            })
        }
    });
}
exports.getMusics = function (req, res) {
    const reg = returnPart(req);
    Music.find({})
        .or([{artist: reg}, {title: reg}])
        .exec(function (err, musics) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }

            musics = musics.map(m => ({...m._doc, id: m._id})).reverse()

            res.status(200);
            res.end(JSON.stringify(musics))
        });
}
exports.getMusicsByIds = function (ids = [], req, res) {
    const reg = returnPart(req);
    Music.find({
        '_id': {$in: ids}
    }).or([{music: reg}, {title: reg}])
        .exec(function (err, musics) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            musics = musics.map(m => ({...m._doc, id: m._id})).reverse()

            res.status(200);
            res.end(JSON.stringify(musics))
        });
}
exports.getOneMusic = function (req, res) {
    const id = req.query.id;

    if (!id) res.sendStatus(500)
    Music.findById(id, function (err, mus) {
        if (err) res.sendStatus(500)
        else {
            res.sendFile(path.join(__dirname, "..", mus.path))
        }
    });
}