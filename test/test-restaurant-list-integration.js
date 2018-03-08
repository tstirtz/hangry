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
                    expect(res.body[0]).to.have.all.keys("userName", "restaurants", "_id");
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
            const newPost = {
                userName: faker.internet.userName(),
                password: faker.internet.password(),
                restaurants: []
            }

            return chai.request(app)
                .post('/user-account')
                .send(newPost)
                .then(function(res){
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.include.keys('userName', 'password', '_id');
                    return Users.findById(res.body._id);
                })
                .then(function(user){
                    expect(user).to.not.be.null;
                    expect(user.userName).to.equal(newPost.userName);
                    expect(user.password).to.equal(newPost.password);
                    expect(user.restaurants).to.not.be.null;
                });
        });
    });
    describe('restaurants create PUT endpoint', function(){
        it('should add a new restaurant to existing user object', function(){
            //create a restaurant object to test with
            const newRestaurant = {
                name: faker.company.companyName(),
                address: faker.address.streetAddress()
            }

            return Users
                .findOne()
                .then(function(user){
                    return chai.request(app)
                        .put(`/restaurants/${user._id}`)
                        .send(newRestaurant)
                        //is .send no ayschronous because we are sending the data to the server rather than receiving data from the server?
                        .then(function(res){
                            expect(res).to.have.status(204);
                            return Users.findById(user.id);
                        })
                        .then(function(userNewRest){
                            const newRestEntry = userNewRest.restaurants.length - 1;
                            expect(userNewRest.restaurants[newRestEntry].name).to.equal(newRestaurant.name);
                            expect(userNewRest.restaurants[newRestEntry].address).to.equal(newRestaurant.address);
                        });

                });
        });
    });

    describe('restaurants update PUT endpoint', function(){
        it('should update existing embedded restaurant document', function(){
            //create test object

            const restToUpdate = {
                name: faker.company.companyName(),
                address: faker.address.streetAddress()
            }

            return Users
                .findOne()
                .then(function(user){
                    return chai.request(app)
                        .put(`/restaurants/edit/${user._id}.${user.restaurants[0]._id}`)
                        .send(restToUpdate)
                        .then(function(res){
                            expect(res).to.have.status(204);
                            return Users.findById(user._id);
                        })
                        .then(function(updated){
                            const updatedRestaurant = updated.restaurants[0];
                            expect(updatedRestaurant.name).to.equal(restToUpdate.name);
                            expect(updatedRestaurant.address).to.equal(restToUpdate.address);
                        });
                });
        });
    });
});
