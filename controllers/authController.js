const SecretKey = require("models/secretKey")

exports.checkSecretKey = function (req, res, next) {
    const secretKey = req.headers['secret-key'];
    if (!secretKey) {
        console.log("НЕТ КЛЮЧА")
        res.status(401)
        res.end()
    }
    SecretKey.find({})
        .exec(function (err, keys) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            if (!keys.map(k => k.key).includes(secretKey)) {
                console.log(secretKey)
                console.log("НЕ ПОДХОДИТ")
                res.status(401)
                res.end()
            } else {
                req.secretKeyId = keys.find(k => k.key === secretKey)._id;

                next()
            }
        });


}