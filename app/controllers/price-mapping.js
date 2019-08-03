var PriceMapping = require("../models/price-mapping");

exports.getPriceMapping = function (req, res, next) {
    PriceMapping.find(function (err, price_mappings) {
        if (err) { res.send(err); }
        res.json(price_mappings);
    });
}

exports.createPriceMapping = function (req, res, next) {
    let priceMapping = req.body;

    let isFound = false;
    PriceMapping.find(function (err, price_mappings) {
        for(var p=0; p<price_mappings.length; p++) {
            if(price_mappings[p].center == priceMapping.center && 
                price_mappings[p].course == priceMapping.course && 
                price_mappings[p].level == priceMapping.level) {
                    isFound = true;
                    let id = price_mappings[p]._id;
                    let priceMapping = req.body;
                
                    PriceMapping.findOneAndUpdate({ _id: id }, priceMapping, { upsert: true, new: true }, function (err, price_mapping) {
                        if (err) { return res.send(err); }
                        PriceMapping.find(function (err,price_mappings) {
                            if (err){ res.send(err); }
                            res.json(price_mappings);
                        });
                    });    
                }
        }
        if(!isFound) {
            PriceMapping.create(priceMapping, function (err, price_mapping) {
                if (err) { res.send(err); }
                PriceMapping.find(function (err, price_mappings) {
                    if (err) { res.send(err); }
                    res.json(price_mappings);
                });
            });
        }
    });

}
