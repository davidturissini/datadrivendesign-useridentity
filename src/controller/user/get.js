'use strict';

const User = require('./../../model/User');
const UserSession = require('./../../model/UserSession');
const rx = require('rx');
const _ = require('lodash');

module.exports = function (req) {

    return rx.Observable.create(function (o) {
        const user_id = req.params.user_id;


        User.findById(user_id, function (err, user) {
            if (err) {
                o.onError(err);
                return;
            }

            o.onNext(user);
            o.onCompleted();

        });
        

    })

    .map((user) => {
        const object = user.toObject();
        return _.omit(object, 'password', 'confirm', 'salt', 'app', '__v');
    });



}