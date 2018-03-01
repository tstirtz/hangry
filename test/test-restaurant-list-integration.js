'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {app, runServer, closeServer} = require('../server');


chai.use(chaiHttp);



describe('Root url GET', function(){
    before(function(){
        runServer()
            .catch(function(err){
                console.log(err);
            })
            .then(function(){
                console.log('success started server');
            })

    });

    after(function(){
        closeServer()
            .catch(function(err){
                console.log(err);
            })
            .then(function(){
                console.log('successfully closed server');
            })
    });


    it('should return mock data', function(){
        app.get('/', function(req, res){
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        });
    });
});

// describe('Display data to client', function(){
//     it('should return an object', function(){
//         expect(getRestaurantData(renderRestaurantList)).to.be.an('object');
//     });
// });
