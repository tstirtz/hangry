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
            const message = `Please input ${requiredFields}`;
            res.status(400).send(message);
        }
    }

    Users
        .create({
            userName: req.body.userName,
            password: req.body.password,
            restaurants:[]

        })
        .then(function(restaurant){
            res.status(201).json(restaurant);
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error: "Something went wrong"});
        });
});


module.exports = router;
