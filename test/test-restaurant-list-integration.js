'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Users} = require('../models/user-model');

const expect = chai.expect;
chai.use(chaiHttp);

function seedTestData(){
    let seededTestData = [];

    for(let i = 0; i < 10; i++){
        seededTestData.push(testDataModel());
    }
    return Users.insertMany(seededTestData);
}

function testDataModel(){
    return{
            userName: faker.internet.userName(),
            password: faker.internet.password(),
            restaurants: [
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
    return Users.deleteMany();
}



describe('Restaurant API', function(){

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedTestData();
    });

    afterEach(function(){
        return tearDownTestDb();
    });

    after(function(){
        closeServer()

    });

    describe('GET endpoint', function(){
        it('should return all user objects', function(){
            let res;

            return chai.request(app)
                .get('/restaurants')
                .then(function(_res){
                    res = _res;
                    console.log(res.body);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    expect(res.body[0]).to.have.all.keys("userName", "restaurants");
                    return Users.count();
                })
                .then(function(data){
                    console.log(data);
                    expect(res.body).to.have.lengthOf(data);
                });
        });
    });

    describe('POST user-account endpoint', function(){
        it('should create a new user object', function(){
            //make a post with new user
            //test post for correct status code
                //json
                //object
            //find post by id that matches post id
            //test that keys match
            const testPost = {
                userName: faker.internet.userName(),
                password: faker.internet.password(),
                restaurants: []
            }

            return chai.request(app)
                .post('/user-account')
                .send(testPost)
                .then(function(res){
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    const newUser = res.body;
                    return newUser;
                })
                .then(function(user){
                    Users.findById(user._id)
                        .then(function(res){
                            console.log(typeof res._id);
                            console.log(typeof user._id);
                            expect(res._id).to.equal(user._id);
                            //need to come up with a different way to compare
                            //the id's
                            expect(res).to.not.be.null;
                            expect(res).to.be.an('object');
                            // expect(res).to.include(user);
                        });
                });
        });
    });
});
