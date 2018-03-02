'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
app.use(express.static('public'));

let server;
let port;

mongoose.Promise = global.Promise;

// app.listen(port = process.env.PORT || 8080, function(){
//     console.log(`Your app is listening on port ${port}`);
// });

// app.get('/', function(req, res){
//
// });

function runServer(databaseUrl, port=PORT){
    return new Promise(function(resolve, reject){
        mongoose.connect(databaseUrl).then(
            function(){
                server = app.listen(port, function(){
                    console.log(`Your app is listening on port ${port}`);
                });
                resolve();
            },
            function(err){
                mongoose.disconnect();
                reject(err);
            }
        );
    });
}

function closeServer(){
    return new Promise(function(resolve, reject){
        mongoose.disconnect().then(
            function(err){
                reject(err);
            },
            function(){
                server.close();
                resolve();
            }
        )
    })
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
  runServer(DATABASE_URL).catch(err=> console.log(err));
}

module.exports = {app, runServer, closeServer};
