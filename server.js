'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {DATABASE_URL} = require('./config');
app.use(express.static('public'));

let port;

let server;

// app.listen(port = process.env.PORT || 8080, function(){
//     console.log(`Your app is listening on port ${port}`);
// });

app.get('/', function(req, res){
    //left of trying to get the mock data to display
});

function runServer(databaseUrl){
    return new Promise(function(resolve, reject){
        mongoose.connect(databaseUrl, {useMongoClient: true}, function(err){
            //{useMongoClient: true} opts you in to using Mongoose 4.11's simplified initial connection logic and allows you to avoid getting a deprecation warning from the underyling MongoDB driver
            if(err){
                console.log(err);
                return reject(err);
            }
            server = app.listen(port = process.env.PORT || 8080, function(){
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
        })
        .on('error', function(err){
            mongoose.disconnect();
            return reject(err);
        });
    });
}

function closeServer(){
    return new Promise(function(resolve, reject){
        console.log('Closing server');
        server.close().on('error', function(err){
            return reject(err);
        })
        resolve();
    });
}


//this runs if server.js is called directly, if this isn't included
    //the server will be started twice when running tests
//module provides a file name property which is the entry point of the current
    //application.
//when ran directly (node server.js vs require('/server')) require.main is set
    //to it's module. So it would equal server.js if ran directly
//therefore require.main === module would return true if ran directly
    //(server.js === server.js)
if (require.main === module) {
  runServer();
}

module.exports = {app, runServer, closeServer};
