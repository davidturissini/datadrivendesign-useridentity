'use strict';

const rx = require('rx');
const mongoose = require('mongoose');

const UserSession = require('./../../model/UserSession');

module.exports = function (req) {

    const userSessionId = req.headers['x-user-session-id'];
    const isValidId = mongoose.Types.ObjectId.isValid(userSessionId);


    return rx.Observable.create(function (o) { 
        if (!isValidId) {
            o.onNext(null);
            o.onCompleted();
            return;
        }


        UserSession.findById(userSessionId, function (err, userSession) {
            if (err) {
                throw new Error(err);
            }

            o.onNext(userSession);
            o.onCompleted();

        });

    })


}