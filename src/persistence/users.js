'use strict';

const users = {};

module.exports = {

    add: function (user) {
        users[user.email] = user;

        return user;
    },

    get: function (email) {
        return users[email];
    }

}