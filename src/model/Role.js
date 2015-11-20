'use strict';

const mongoose = require('mongoose');

const Role = mongoose.model('Role', {
    name: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true
    }
});

module.exports = Role;