'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App',
        required: true
    }
});

schema.index({
    app: 1,
    username: 1 
},{
    unique: true
});


module.exports = schema;