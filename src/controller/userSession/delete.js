'use strict';

const rx = require('rx');
const userSessions = require('./../../model/UserSession');
const user = require('./../../model/User');

module.exports = function (req) {

    return rx.Observable.return(req.body)
        
        // ensure user exists
        .flatMapLatest((params) => {

            return rx.Observable.create(function (o) {
                userSessions[params.id];

                o.onNext(params);
            });

        })

        .map((userSession) => {
            return JSON.stringify({});
        })
}