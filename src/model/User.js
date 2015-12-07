'use strict';

const mongoose = require('mongoose');
const personSchema = require('./../schema/person');

const User = mongoose.model('User', personSchema);

module.exports = User;