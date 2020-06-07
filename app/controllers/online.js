var Online = require('../models/online');

exports.getOnline = function (req, res, next) {
    Online.find(function (err, onlines) {
        if (err) { res.send(err); }
        res.json(onlines);
    });
}

exports.createOnline = function (req, res, next) {
    console.log('req.headers ------------------------------');
    console.log(req.headers);
    console.log('req.headers ------------------------------');

    // capture the encoded form data
    req.on('data', (data) => {
        console.log('data.toString() ------------------------------');
        console.log(data.toString());
        console.log('data.toString() ------------------------------');
    });
  
    req.on('end', (data) => {
        console.log('data.toString() ------------------------------');
        console.log(data.toString());
        console.log('data.toString() ------------------------------');
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
