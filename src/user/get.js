'use strict';

const users = require('./../persistence/users');
const userSessions = require('./../persistence/userSession');
const rx = require('rx');
const _ = require('lodash');

module.exports = function (req) {


    // verify that we have an x-auth-token
    return rx.Observable.create(function (o) {
        const tokenString = req.headers['x-auth-token'];

        if (!tokenString) {
            throw new Error('Token missing');
        }

        
        const session = userSessions.get(tokenString);

        if (!session) {
            throw new Error('Invalid token');
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
                throw new Error('Invalid token');
            }

            o.onNext(user);

        });
    })

    .map((user) => {
        const json = _.omit(user, 'password', 'confirm');
        return JSON.stringify(json);
    });



}