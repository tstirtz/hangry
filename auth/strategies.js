'use strict'

let passport = reqiure('passport'), LocalStrategy = require('passport-local').Strategy;

const {Users} = require('../models/user-models');
const {JWS_SECRET} = require('../config');

passport.use(new LocalStrategy(
    function(username, passport, callback){
        let user;
        Users.findOne({userName: username})
        .then(function(_user){
            user = _user;
            if(!user){
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return user.validatePassword(password);
        })
        .then(function(isValid){
            if(!isValid){
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return callback(null, user);
        })
        .catch(function(err){
            if(err.reason === 'LoginError'){
                return callback(null, false, err);
            }
            return callback(err, false);
        });
    }
));

module.exports = {localStrategy};
