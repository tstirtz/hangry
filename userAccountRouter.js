const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {DATABASE_URL, PORT} = require('./config');
const {Users} = require('./models/user-model');

const jsonParser = bodyParser.json();


//endpoint for creating a new account
router.post('/', jsonParser, function(req, res){
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
    const nonTrimmedFields = fieldsToTrim.find(field => req.body[field].trim() !== req.body[field]);
    console.log(nonTrimmedFields);

    if(nonTrimmedFields){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedFields
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

    // const tooSmallField = Object.keys(sizedFields).find(function(field){
    //     req.body[field].trim().length < sizedFields[field].min
    // });
    // console.log(tooSmallField);

    const tooLargeField = Object.keys(sizedFields).find(function(field){
        return 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    });

    if(req.body.password.length < 10){
        console.log("tooSmallField executed");
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: `Password must be at least 10 characters long`
        });
    }else if(tooLargeField){
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: `Password must not be more than 72 characters
            long`
        });
    }
    console.log("Did not return response");
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
            return Users
                .create({
                    userName: req.body.userName,
                    password: hash
                });
        })
        .then(function(user){
            //make request to /login route
            return res.status(201).json(user.userData());
        })
        .catch(function(err){
            console.log(err);
            if(err.reason === 'ValidationError'){
                res.status(err.code).json(err);
            }
            res.status(500).send({code: 500, message: "Internal server error"});
        });
});


module.exports = router;
