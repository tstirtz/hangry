'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
const morgan = require('morgan');

app.use(morgan('common'));
app.use(express.static('public'));

const restaurantListRouter = require('./restaurantListRouter');

let server;
let port;

mongoose.Promise = global.Promise;


app.use('/lists', restaurantListRouter);

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
//Start here: set up GET route and unit test for GET route. Before starting research
//whether or not I should make a router file

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

//when requests come into /lists we will route them to to express router instance
//we have imported


module.exports = {app, runServer, closeServer};
