const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
const {Users} = require('./models/user-model');

const jsonParser = bodyParser.json();

router.get('/', function(req, res){
    Users
        .find()
        .then(function(items){
            console.log(items);
            res.json(items.map(item => item.userData()));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Something went terribly wrong"});
        });
});

router.put('/:id', jsonParser, function(req, res){
    //this route will add a new restaurant
    let requiredFields = ["name", "address"];

    for(let i = 0; i < requiredFields.length;){
        if(requiredFields[i] in req.body){
            i++;
        } else{
            res.status(400).json({error: `Please provide a ${requiredFields[i]}`});
            return;
        }
    }
    //Is it better practice to have a test in the back end to make sure both the name and address are present in the request body, or is making the fields in the form in the front-end required sufficient enough?


    Users
        .findByIdAndUpdate(req.params.id, {$addToSet: {restaurants: {name: req.body.name, address: req.body.address}}})
        .then(function(newRest){
                console.log(newRest);
                res.status(204).json({message: "Restaurant added!"});
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong"});
        });
});




//exports the express app used in this file
module.exports = router;
