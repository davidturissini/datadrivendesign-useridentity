'use strict';


const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;


const Domain = mongoose.model('Domain', {
    name: {
        type: String
    },
    key: {
        type: ObjectId,
        required: true,
        index: {
            unique: true
        }
    }
});

Domain.dogfood = function (cb) {
    return Domain.findByKey('564aa7e623012238711bac64', cb);
};

module.exports = Domain;