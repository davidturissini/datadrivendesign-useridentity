'use strict';

const rx = require('rx');

const User = require('./../../model/User');

module.exports = function (req) {
    const userId = req.params.user_id;

    return rx.Observable.create(function (o) { 
        User.findById(userId, function (err, user) {
            if (err) {
                throw new Error(err);
            }

            o.onNext(user);
            o.onCompleted();

        });

    })


}