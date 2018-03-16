'use strict'

// let passport = require('passport')
//     , LocalStrategy = require('passport-local').Strategy;
// let JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;

const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

//left off trying to get login to work on postman. Went attempted, endpoint won't
//return JWT

const {Users} = require('../models/user-model');
const {JWT_SECRET} = require('../config');

let localStrategy = new LocalStrategy(
    {usernameField: 'userName', passwordField: 'password'},
    function(username, password, done){
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
            return done(null, user);
        })
        .catch(function(err){
            if(err.reason === 'LoginError'){
                return done(null, false, err);
            }
            console.log(err);
            return done(err, false);
        });
    }
);

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    },
    function(payload, done){
        done(null, payload.user);
    }
);

module.exports = {localStrategy, jwtStrategy};
