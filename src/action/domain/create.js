'use strict';

const rx = require('rx');

// Model
const Domain = require('./../../model/Domain');

module.exports = function (params) {

    return rx.Observable.create(function (o) {

        Domain.create(params, function (err, domain) {
            if (err) {
                o.onError(err);
            }

            o.onNext(domain);
            o.onCompleted();
        })

    });

}