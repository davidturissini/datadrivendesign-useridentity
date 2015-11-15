'use strict';

const users = require('./users');

const uuid = require('uuid');
const sessions = {
    '362edc3a-b39a-4250-ac59-9370d5b6511d': {
        user_id: 1,
        id:'362edc3a-b39a-4250-ac59-9370d5b6511d'
    }
};

module.exports = {

    create: function (user) {
        const sessionId = '362edc3a-b39a-4250-ac59-9370d5b6511d';
        const session = {
            user_id: user.id,
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
    },

    findUserBySessionId (sessionId) {
        const session = this.get(sessionId);

        return users.get(session.user_id);
    }

}