'use strict'
const express = require('express');
const app = express();
app.use(express.static('public'));

let port;

let server;

// app.listen(port = process.env.PORT || 8080, function(){
//     console.log(`Your app is listening on port ${port}`);
// });

function runServer(){
    return new Promise(function(resolve, reject){
        server = app.listen(port = process.env.PORT || 8080, function(){
            console.log(`Your app is listening on port ${port}`);
        })
        .on('error', function(err){
            return reject(err);
        })
        resolve();
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
