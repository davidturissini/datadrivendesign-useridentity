'use strict';

const rx = require('rx');
const UserSession = require('./../../model/UserSession');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const domainFromRequestStream = require('./../../stream/app/fromRequest');
const domainCreateUserSessionAction = require('./../../action/app/createUserSession');

// Formatters
const userAttributesObjectFormatter = require('./../../formatters/user/userAttributesObject');

module.exports = function (req) {

    const domainStream = domainFromRequestStream(req);
    const params = req.body;

    return domainStream.flatMapLatest((app) => {
        return domainCreateUserSessionAction(app, params);
    })

    .map((userSession) => {
        const userAttributes = userAttributesObjectFormatter(userSession.user);
        userAttributes.id = userSession.user._id;

        return {
            type: 'usersession',
            id: userSession.get('id'),
            relationships: {
                user: userAttributes
            }
        }

    });

}