'use strict';

const rx = require('rx');

// Model
const App = require('./../../model/App');

module.exports = function (params) {

    return rx.Observable.create(function (o) {

        App.create(params, function (err, domain) {
            if (err) {
                o.onError(err);
            }

            o.onNext(domain);
            o.onCompleted();
        })

    });

}