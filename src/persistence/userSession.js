'use strict';

const uuid = require('uuid');
const sessions = {
    '362edc3a-b39a-4250-ac59-9370d5b6511d': {
        user_id: 1,
        id:'362edc3a-b39a-4250-ac59-9370d5b6511d'
    }
};

module.exports = {

    create: function (user) {
        const sessionId = uuid();
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
    }

}