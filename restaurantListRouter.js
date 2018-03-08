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
                res.status(204).json({message: "Restaurant added!"});
    //This JSON message isn't sent to the user after a successful PUT call???
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong"});
        });
});

router.put('/edit/:userId.:restaurantId', jsonParser, function(req, res){
    //this route will allow user to edit an existing restaurant by searching
    //for restaurant doc by id

    //establish required required requiredFields
    let requiredFields = ["name", "address"];
    //test that all requiredFields are present
        //when the user clicks the edit button the current restaurant name and address
        //will be populated into an input field, therefore I should test that they are both present
    for(let i = 0; i < requiredFields.length;){
        if(requiredFields[i] in req.body){
            i++;
        } else{
            res.status(400).json({error: `Please provide a ${requiredFields[i]}`});
            return;
        }
    }

    Users
        .findById(req.params.userId)
        .then(function(user){

            user.restaurants.id(req.params.restaurantId).name = req.body.name;
            user.restaurants.id(req.params.restaurantId).address = req.body.address;
            user.save(function(){
                res.status(204).end();
            });
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong!"});
        });
});

router.delete('/delete/:userId.:restaurantId', function(req, res){
    Users
        .findById(req.params.userId)
        .then(function(user){
            user.restaurants.id(req.params.restaurantId).remove();
            user.save(function(){
                console.log(`Deleted restaurant with id ${req.params.restaurantId}`)
                res.status(204).end();
            });
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong!"});
        })
})




//exports the express app used in this file
module.exports = router;
