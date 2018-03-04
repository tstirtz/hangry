const express = require('express');
const router = express.Router();
const {DATABASE_URL, PORT} = require('./config');
const {Restaurant} = require('./models/user-model');

router.get('/', function(req, res){
    Restaurant
        .find()
        .then(function(items){
            res.json(items.map(item => item.userData()));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Something went terribly wrong"})
        });
});



module.exports = router;
