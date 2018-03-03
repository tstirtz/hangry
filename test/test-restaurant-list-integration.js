'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Restaurant} = require('../model');


chai.use(chaiHttp);

function seedTestData(){
    let seededTestData = [];

    for(let i = 0; i < 10; i++){
        seededTestData.push(testDataModel());
    }

    return Restaurant.insertMany(seededTestData);
}

function testDataModel(){
    return{
            userName: faker.internet.userName(),
            password: faker.internet.password(),
            list: [
                {
                    name: faker.company.companyName(),
                    address: faker.address.streetAddress()
                },
                {
                    name: faker.company.companyName(),
                    address: faker.address.streetAddress()
                },
                {
                    name: faker.company.companyName(),
                    address: faker.address.streetAddress()
                },
                {
                    name: faker.company.companyName(),
                    address: faker.address.streetAddress()
                }
            ]
        };
}

function tearDownTestDb(){
    console.log("Deleting database");
    return Restaurant.deleteMany();
}



describe('Restaurant API', function(){

    before(function(){
        runServer(TEST_DATABASE_URL)
            // .catch(function(err){
            //     console.log(err);
            // });
            // .then(function(){
            //     console.log('success started server');
            // });
    });

    beforeEach(function(){
        seedTestData();
    });

    afterEach(function(){
        tearDownTestDb();
    });

    after(function(){
        closeServer()
            // .catch(function(err){
            //     console.log(err);
            // });
            // .then(function(){
            //     console.log('successfully closed server');
            // })
    });

    describe('GET endpoint', function(){
        it('should return all user objects', function(){
            let res;

            return chai.request(app)
                .get('/lists')
                .then(function(_res){
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    expect(res.body[0]).to.have.all.keys('userName', 'list');
                    return Restaurant.count();
                })
                .then(function(data){
                    expect(res.body).to.have.lengthOf(data);
                });
        });
    });
});

// describe('Display data to client', function(){
//     it('should return an object', function(){
//         expect(getRestaurantData(renderRestaurantList)).to.be.an('object');
//     });
// });
