'use strict';

const rx = require('rx');
const UserSession = require('./../../model/UserSession');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const domainFromRequestStream = require('./../../stream/domain/fromRequest');
const domainCreateUserSessionAction = require('./../../action/domain/createUserSession');

module.exports = function (req) {

    req.params.domain_id = '564e940cd8cb7c747829f119';
    req.headers['x-domain-key'] = '564aa7e623012238711bac64';

    const domainStream = domainFromRequestStream(req);
    const params = req.body;

    return domainStream.flatMapLatest((domain) => {
        return domainCreateUserSessionAction(domain, params);
    });

}