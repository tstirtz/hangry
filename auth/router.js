'use strict'

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {Users} = require('../models/user-model');

const config = require('../config');
const router = express.Router();


const createAuthToken = function(user){
        return jwt.sign({user}, config.JWT_SECRET, {
            subject: user.userName,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        });
}


const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//user login endpoint
router.post('/', localAuth, function(req, res){

    const authToken = createAuthToken(req.user.forAuthToken());
    return res.json({id: req.user._id, jwt: authToken});
});

module.exports = {router, createAuthToken};
