'use strict'

const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const {Users} = require('../models/user-model');
const {JWT_SECRET} = require('../config');

//strategy used for authorization of /login endpoint
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
