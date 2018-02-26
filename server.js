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
    server = app.listen(port = process.env.PORT || 8080, function(){
        console.log(`Your app is listening on port ${port}`);
    });
}

function closeServer(){
    console.log('Closing server');
    server.close();
}


//this runs if server.js is called directly, if this isn't included
//the server will be attempted to start twice when running tests
if (require.main === module) {
  runServer();
}

module.exports = {app, runServer, closeServer};
