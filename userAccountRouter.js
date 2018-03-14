const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {DATABASE_URL, PORT} = require('./config');
const {Users} = require('./models/user-model');

const jsonParser = bodyParser.json();


//endpoint for creating a new account
router.post('/', jsonParser, function(req, res){
    console.log(req.body);
    const requiredFields = ['userName', 'password'];
    for(let i = 0; i < requiredFields.length; i++){
        if(!(requiredFields[i] in req.body)){
            return res.status(422).json({
                code: 422,
                reason: 'ValidationError',
                message: 'Missing field',
                location: requiredFields[i]
            });
        }
    }

    const fieldsToTrim = ['userName', 'password'];
    const nonTrimmedFields = fieldsToTrim.find(function(field){
        req.body[field].trim() !== req.body[field]
    });

    if(nonTrimmedFields){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    //check for correct length of userName and password

    const sizedFields = {
        userName: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(function(field){
        req.body[field].trim().length < sizedFields[field].min
    });

    const tooLargeField = Object.keys(sizedFields).find(function(field){
        'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    });

    if(tooSmallField){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: `Password must be at least ${sizedFields[tooSmallField].min} characters
            long`,
            location: tooSmallField
        });
    }else if(tooLargeField){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: `Password must not be more than ${sizedFields[tooLargeField].max} characters
            long`,
            location: tooLargeField
        })
    }

    return Users
        .find({userName: req.body.userName})
        .count()
        .then(function(count){
            if(count > 0){
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'userName'
                });
            }
            //hashPassword is a static function defined on the userSchema which
            //uses bcryptjs to hash the password
            return Users.hashPassword(req.body.password);
        })
        .then(function(hash){
            console.log(`This is the hash: ${hash}`);
            return Users
                .create({
                    userName: req.body.userName,
                    password: hash
                });
        })
        .then(function(user){
            return res.status(201).json(user.userData());
        })
        .catch(function(err){
            console.log(err);
            if(err === 'ValidationError'){
                res.status(err.code).json(err);
            }
            res.status(500).send({code: 500, message: "Internal server error"});
        });
});


module.exports = router;
