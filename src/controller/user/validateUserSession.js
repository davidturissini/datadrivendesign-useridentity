'use strict';

// Action
const userValidateUserSessionFromRequest = require('./../../action/user/validateUserSessionFromRequest');

module.exports = function (req) {

    return userValidateUserSessionFromRequest(req);

}