'use strict';

const rx = require('rx');
const User = require('./../../model/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const domainFromRequestStream = require('./../../stream/domain/fromRequest');
const domainCreateUserAction = require('./../../action/domain/createUser');

module.exports = function (req) {

    const domainStream = domainFromRequestStream(req);
    const params = req.body;

    return domainStream.flatMapLatest((domain) => {
        return domainCreateUserAction(domain, params);
    });

}