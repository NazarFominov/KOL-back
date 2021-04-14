const AlbumsMusic = require("models/old/albumsMusic")
const musicController = require("controllers/musicController")
const path = require("path")

exports.addAlbum = function (albumId) {
    if (!albumId) return new Error();

    const albumsMusic = new AlbumsMusic({
        albumId: albumId,
        musicsIds: []
    })

    albumsMusic.save(function (err) {
        if (err) return new Error();
    })
}
exports.deleteAlbum = function (albumId) {
    if (!albumId) return new Error();

    AlbumsMusic.findOneAndDelete({albumId: albumId}, function (err) {
        if (err) return new Error();
    })
}

exports.deleteMusic = function (musicId) {
    if (!musicId) return new Error();

    AlbumsMusic.find({}, function (err, albums) {
        if (err) return new Error();
        albums.forEach(a => {
            console.log(a.musicsIds.filter(id => id !== musicId))
            if (a.musicsIds.includes(musicId)) {
                const update = {musicsIds: a.musicsIds.filter(id => id !== musicId)}
                AlbumsMusic.findByIdAndUpdate(a.id, update, function (err) {
                    if (err) console.log(err)
                })
            }
        })
    })
}

exports.addMusicsInAlbum = function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const albumId = req.params.id;
    const {musicsIds} = req.body;

    AlbumsMusic.updateOne({albumId}, {musicsIds: musicsIds}, function (err) {
        if (err) res.sendStatus(500)
        res.sendStatus(204)
    })
}

exports.getMusicsIds = function (req, res) {
    const albumId = req.params.id;

    if (!albumId) return res.sendStatus(500);

    AlbumsMusic.findOne({albumId: albumId}, function (err, {musicsIds}) {
        if (err) res.sendStatus(500)
        res.status(200)
        res.end(JSON.stringify(musicsIds))
    })
}

exports.getMusics = function (req, res) {
    const albumId = req.params.id;
    if (!albumId) return res.sendStatus(500);

    AlbumsMusic.findOne({albumId: albumId}, function (err, {musicsIds}) {
        if (err) res.sendStatus(500)
        if (musicsIds.length) {
            musicController.getMusicsByIds(musicsIds, req, res)
        } else {
            res.status(200)
            res.end(JSON.stringify([]))
        }
    })


}