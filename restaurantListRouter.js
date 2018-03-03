const express = require('express');
const router = express.Router();
const {DATABASE_URL, PORT} = require('./config');
const {Restaurant} = require('./model');

router.get('/', function(req, res){
    Restaurant
        .find()
        .then(function(items){
            res.json(items.map(item => item.userData()));
        });
});

//left off trying to get db to return mock data

module.exports = router;
