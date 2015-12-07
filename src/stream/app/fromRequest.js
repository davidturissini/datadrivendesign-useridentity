'use strict';

const App = require('./../../model/App');
const rx = require('rx');

const mongoose = require('mongoose');


module.exports = function (req) {
    const appId = req.params.app_id;
    
    const isValidAppId = mongoose.Types.ObjectId.isValid(appId);


    return rx.Observable.create(function (o) {
        if (!isValidAppId) {
            o.onNext(null);
            o.onCompleted();
            return;
        }

        App.findById(appId, function (err, app) {
            if (err) {
                o.onError(err.message);
            }

            o.onNext(app);
            o.onCompleted();

        });

    });

}