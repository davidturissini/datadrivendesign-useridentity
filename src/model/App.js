'use strict';


const mongoose = require('mongoose');


const App = mongoose.model('App', {
    name: {
        type: String,
        default: function () {
            return 'Untitled';
        }
    },
    key: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});


module.exports = App;