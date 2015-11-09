'use strict';

const rx = require('rx');
const users = require('./../persistence/users');

module.exports = function (req) {
    return rx.Observable.return(req.body)

    // Check for dupes
    .flatMapLatest((params) => {
        return rx.Observable.create(function (o) {
            if (users.get(params.email)) {
                throw new Error('E-mail already exists');
            }

            o.onNext(params);
        });
    })

    // Check for valid email address
    .flatMapLatest((params) => {
        return rx.Observable.create(function (o) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (!re.test(params.email)) {
                throw new Error('Not a valid e-mail address');
            }

            o.onNext(params);

        });
    })

    // Check to make sure confirm and password match
    .flatMapLatest((params) => {
        return rx.Observable.create(function (o) {
            if (params.confirm !== params.password) {
                throw new Error('Confirm did not match password');
            }

            o.onNext(params);
        });
    })

    // Save user
    .flatMapLatest((params) => {
        return rx.Observable.create(function (o) {
            const user = users.create(params);

            o.onNext(user);
        });
    })
    .map((user) => {
        return JSON.stringify(user);
    });

}