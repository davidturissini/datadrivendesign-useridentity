'use strict';

const User = require('./../../model/User');
const UserSession = require('./../../model/UserSession');
const rx = require('rx');
const _ = require('lodash');

module.exports = function (req) {


    // verify that we have an x-auth-token
    return rx.Observable.create(function (o) {
        const tokenString = req.headers['x-auth-token'];

        if (!tokenString) {
            o.onError('Token missing');
        }

        
        const session = userSessions.get(tokenString);

        if (!session) {
            o.onError('Invalid token');
        }

        o.onNext({
            session: session,
            req: req
        }); 

    })

    // verify that the token has permissions to read the user
    .flatMapLatest((params) => {
        return rx.Observable.create(function (o) {

            const user = users.get(params.req.params.user_id);
            const sessionUser = userSessions.findUserBySessionId(params.session.id);


            if (user.id !== sessionUser.id) {
                o.onError('Invalid token');
            }

            o.onNext(user);

        });
    })

    .map((user) => {
        const json = _.omit(user, 'password', 'confirm');
        return JSON.stringify(json);
    });



}