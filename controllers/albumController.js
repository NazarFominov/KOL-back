const Album = require("models/old/album")
const AlbumsMusic = require("models/old/albumsMusic")
const {addAlbum, deleteAlbum} = require("controllers/albumsMusicController")
const path = require("path")
const fs = require("fs")
const gm = require("gm")
const resize = require('resize-img')

async function resizeCover(fileData) {
    const image = await resize(fs.readFileSync(path.join(__dirname, "..", fileData.path)), {
        width: 500,
        height: 500
    });

    fs.writeFileSync(path.join(__dirname, "..", fileData.path), image);
}

exports.addAlbum = function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {body} = req;
    let fileData = req.file;

    resizeCover(fileData)

    Album.create({
        title: body.title || "Без имени",
        pathToCover: fileData ? fileData.path : null
    }, function (err, album) {
        if (err) return res.sendStatus(500)
        else {
            try {
                res.sendStatus(204)
                console.log(album.id)
                addAlbum(album.id)
            } catch (e) {
                console.log(e);
                res.sendStatus(500)
            }
        }
    })
}

exports.editAlbum = function (req, res) {
    if (!req.body) return res.sendStatus(500);

    const {body} = req;
    const fileData = req.file;
    const {id} = body

    Album.findById(id, function (err, alb) {
        if (err) {
            console.log(err)
            res.sendStatus(500)
        }

        if (fileData && alb.pathToCover) fs.unlink(path.join(__dirname, "..", alb.pathToCover), (err) => {
            if (err) console.log(err)
        })
        if (fileData) resizeCover(fileData)


        const album = {
            title: body.title || "Без имени",
            pathToCover: fileData ? fileData.path : alb.pathToCover
        }

        Album.findByIdAndUpdate(id, album, function (err) {
            if (err) {
                console.log(err)
                res.sendStatus(500)
            } else res.sendStatus(204)
        });
    })
}

exports.deleteAlbum = function (req, res) {
    const id = req.params.id;

    if (!id) res.sendStatus(500)

    Album.findByIdAndDelete(id, null, function (err, alb) {
        if (err) res.sendStatus(500)
        else {
            if (alb.pathToCover) {
                fs.unlink(path.join(__dirname, "..", alb.pathToCover), (err) => {
                    if (err) console.log(err)
                })
            }
            try {
                deleteAlbum(id);
                res.sendStatus(204)
            } catch (e) {
                console.log(e)
                res.sendStatus(500)
            }
        }
    });
}

exports.getAlbum = function (req, res) {
    const id = req.params.id;

    if (!id) res.sendStatus(500)

    Album.findById(id, function (err, alb) {
        if (err) res.sendStatus(500)
        else {
            res.status(200);
            res.end(JSON.stringify({title: alb.title, id: alb.id}))
        }
    });
}

exports.getAlbumCover = function (req, res) {
    const id = req.params.id;

    if (!id) res.sendStatus(500)

    Album.findById(id, function (err, alb) {
        if (err) res.sendStatus(500)
        else {
            if (alb.pathToCover) {
                res.status(200);
                let buff = fs.readFileSync(path.join(__dirname, "..", alb.pathToCover));
                let base64data = buff.toString('base64');

                res.send(base64data)

                // res.sendFile(path.join(__dirname, "..", alb.pathToCover))
            } else {
                res.sendStatus(204)
            }
        }
    });

}

exports.getAlbums = function (req, res) {
    Album.find({}, function (err, albums) {
        if (err) {
            console.log(err);
            return res.sendStatus(400);
        }

        albums = albums.map(a => ({...a._doc, id: a._id})).reverse()

        res.status(200);
        res.end(JSON.stringify(albums.map(a => ({title: a.title, id: a.id}))))
    });
}
