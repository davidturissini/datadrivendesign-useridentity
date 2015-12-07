'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


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
    },
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: false,
        match: [emailRegexp, 'Please fill a valid email address']
    }
});

schema.index({
    app: 1,
    username: 1 
},{
    unique: true
});



module.exports = schema;