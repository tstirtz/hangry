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

router.post('/', localAuth, function(req, res){
    const authToken = createAuthToken(req.user.forAuthToken());
    console.log(req.user);

    res.cookie('id', `${req.user._id}`);
    res.cookie('jwt', authToken);
    res.redirect('/dashboard');
});


//need to figure out where this authToken is attached to a request in order to
//properly set up tests

module.exports = {router};
