var Online = require('../models/online');

exports.getOnline = function (req, res, next) {
    Online.find(function (err, onlines) {
        if (err) { res.send(err); }
        res.json(onlines);
    });
}

exports.createOnline = function (req, res, next) {
    console.log('---------------------------------------------------------');
    console.log('---------------------------------------------------------');
    console.log('---------------------------------------------------------');
    console.log(req);
    console.log('---------------------------------------------------------');
    console.log('---------------------------------------------------------');
    console.log('---------------------------------------------------------');
    let online = req.body;
    Online.create(online, function (err, online) {
        if (err) { res.send(err); }
        res.json(online);
    });
}

exports.updateOnline = function (req, res, next) {
    let id = req.body._id;
    let online = req.body;
    delete online._id;

    Online.findOneAndUpdate({ _id: id }, online, { upsert: true, new: true }, function (err, online) {
        if (err) return res.send(err);
        res.json(online);
    });
}
