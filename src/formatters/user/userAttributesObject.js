'use strict';

const _ = require('lodash');


module.exports = function (user) {
    const obj = _.omit(user.toObject(), '__v', 'salt', 'password', '_id');

    return obj;
}