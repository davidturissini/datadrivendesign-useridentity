'use strict';

const rx = require('rx');
const UserSession = require('./../../model/UserSession');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const domainFromRequestStream = require('./../../stream/domain/fromRequest');
const domainCreateUserSessionAction = require('./../../action/domain/createUserSession');

module.exports = function (req) {

    const domainStream = domainFromRequestStream(req);
    const params = req.body;

    return domainStream.flatMapLatest((domain) => {
        return domainCreateUserSessionAction(domain, params);
    });

}