'use strict';

const users = require('./../persistence/users');
const userSessions = require('./../persistence/userSession');
const rx = require('rx');
const _ = require('lodash');

module.exports = function (req) {

    return rx.Observable.create(function (o) {
        const tokenString = req.headers['x-auth-token'];

        if (!tokenString) {
            throw new Error('Token missing');
        }

        const session = userSessions.get(tokenString);

        o.onNext(session); 

    })

    .flatMapLatest((session) => {
        return rx.Observable.create(function (o) {
            const user = users.get(session.user_id);

            if (!user) {
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