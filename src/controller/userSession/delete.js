'use strict';

const rx = require('rx');

// Model
const UserSession = require('./../../model/UserSession');

// Action
const userValidateUserSessionFromRequest = require('./../../action/user/validateUserSessionFromRequest');


module.exports = function (req) {
    const userSessionId = req.body.data.id;

    return userValidateUserSessionFromRequest(req)
        .flatMapLatest(() => {
            return rx.Observable.create(function (o) {

                UserSession.remove({
                    _id: userSessionId
                }, function (err, userSession) {
                    if (err) {
                        o.onError(err);
                    }

                    o.onNext({});
                    o.onCompleted();
                });

            });

        });
}