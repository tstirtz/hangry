const express = require('express');
const router = express.Router();
const {DATABASE_URL, PORT} = require('./config');

router.get('/', function(req, res){
    res.send("/lists working");
});

module.exports = router;
