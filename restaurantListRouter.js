const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const {DATABASE_URL, PORT} = require('./config');
const {Users} = require('./models/user-model');
let path = require('path');

const jsonParser = bodyParser.json();
const {jwtStrategy} = require('./auth/strategies');
const jwtAuth = passport.authenticate('jwt', {session: false});

passport.use(jwtStrategy);

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public') + '/user-dashboard.html');
});

router.get('/restaurants/:id', jwtAuth, function(req, res){
    //This endpoint will return all restaurants for a user
    Users
        .findById(req.params.id)
        .then(function(user){
            console.log(user);

            res.json(user.restaurants.map(restaurant=>{
                return restaurant;
                }));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Something went terribly wrong"});
        });
});

router.put('/restaurants/:id', [jsonParser, jwtAuth], function(req, res){
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

    Users
        .findByIdAndUpdate(req.params.id, {$addToSet: {restaurants: {name: req.body.name, address: req.body.address}}})
        .then(function(newRest){
                res.status(201).json({message: "Restaurant added!"});
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong"});
        });
});

router.put('/restaurants/edit/:userId.:restaurantId', [jsonParser, jwtAuth], function(req, res){
    //this route will allow user to edit an existing restaurant by searching
    //for restaurant doc by id

    let requiredFields = ["name", "address"];

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
            res.status(500).json({error: "Something went terribly wrong!"});
        });
});

router.delete('/restaurants/delete/:userId.:restaurantId', jwtAuth, function(req, res){
    Users
        .findById(req.params.userId)
        .then(function(user){
            console.log(user);
            if(!(user.restaurants.id(req.params.restaurantId))){
                res.status(400).json({message: `Restaurant with id ${req.params.restaurantId} does not exist`});
            }else {
                user.restaurants.id(req.params.restaurantId).remove();
                user.save(function(){
                    console.log(`Deleted restaurant with id ${req.params.restaurantId}`);
                    res.status(204).end();
                });
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong!"});
        });
});

router.get('/restaurants/random/:userId', jwtAuth, function(req, res){
//this route returns a random restaurant
    Users
        .findById(req.params.userId)
        .then(function(user){
            if(user.restaurants.length <= 1){
                res.json({message: "Please add at least 2 restaurants."})
            }else{
                let count = user.restaurants.length;
                let index = Math.floor(Math.random() * count);
                let randomRestaurant = user.restaurants[index];

                res.json(randomRestaurant);
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json({message: "Something went terribly wrong!"});
        });

});




//exports the express app used in this file
module.exports = router;
