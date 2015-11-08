'use strict';

const uuid = require('uuid');
const sessions = {};

module.exports = {

    create: function () {
        const sessionId = uuid();
        const session = {
            id: sessionId
        };

        sessions[sessionId] = session;

        return session;
    },

    get: function (id) {
        return sessions[id];
    },

    remove: function (id) {
        delete sessions[id];
    }

}