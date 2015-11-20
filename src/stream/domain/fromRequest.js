'use strict';

const Domain = require('./../../model/Domain');
const rx = require('rx');

const mongoose = require('mongoose');


module.exports = function (req) {
    const domainId = req.params.domain_id;
    const domainKey = req.headers['x-domain-key'];
    console.log('domainid', domainId);
    console.log('domainkey', domainKey);
    const isValidDomainKey = mongoose.Types.ObjectId.isValid(domainKey);
    const isValidDomainId = mongoose.Types.ObjectId.isValid(domainId);

    return rx.Observable.create(function (o) {
        if (!isValidDomainKey || !isValidDomainId) {
            o.onNext(null);
            o.onCompleted();
            return;
        }

        Domain.findOne({
            _id: domainId,
            key: domainKey
        }, function (err, domain) {
            if (err) {
                o.onError(err.message);
            }

            o.onNext(domain);
            o.onCompleted();

        });

    });

}