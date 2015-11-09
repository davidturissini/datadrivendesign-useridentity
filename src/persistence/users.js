'use strict';

const users = {
    '1': {
        id: 1,
        email: 'test@user.com',
        password: 'password'
    }
};

module.exports = {

    create: function (user) {
        user.id = Object.keys(users).length;
        users[id] = user;

        return user;
    },

    findByEmail: function (email) {
        return Object.keys(users).map(function (key) {
            return users[key];
        }).filter(function (user) {
            return (user.email === email);
        })[0];
    },

    get: function (id) {
        return users[id];
    }

}