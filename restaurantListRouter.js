const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {DATABASE_URL, PORT} = require('./config');
const {Users, Restaurant} = require('./models/user-model');

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
            res.status(500).json({error: "Something went terribly wrong"})
        });
});

router.put('/:id', jsonParser, function(req, res){
    //create new restaurant object and update restaurant property
    const newRestaurant = {
        name: req.body.name,
        address: req.body.address
    }

    Users
        .findById(req.params.id)
        .then(function(user){
            console.log(user.restaurants);
            console.log(newRestaurant);
            user.restauraunts.push(newRestaurant);
            //left off trying to figure out why push method won't work
            //I stashed my work
            user.save(function(updatedUser){
                res.status(204).json(updatedUser);
            });
        });
    //get user object by id
    //update restaurants array with new Restaurant document
});




//exports the express app used in this file
module.exports = router;
