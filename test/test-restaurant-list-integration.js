'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Users} = require('../models/user-model');
const {createAuthToken} = require('../auth/router')

const expect = chai.expect;
chai.use(chaiHttp); //allows me to make http requests in tests

function seedTestData(){
    let seededTestData = [];
    console.log("Seeding database");
    for(let i = 0; i < 10; i++){
        seededTestData.push(testDataModel());
    }
    return Users.insertMany(seededTestData);
}

function testDataModel(){

    // return Users.hashPassword(faker.internet.password())
    //     .then(function(hash){
    //         console.log(".then function")
             return {
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
        // });
}

function tearDownTestDb(){
    console.log("Deleting database");
    return Users.deleteMany();
}

// function login(){
//     console.log("Logging in user");
//     return User.findOne()
//         .then(function(user){
//             return chai.request(app)
//                 .post('/login')
//                 .send({'userName': user.userName, 'password': user.password})
//                 .then(function(){
//                     return user._id;
//                 });
//                 // .then(function(req, res){
//                 //     expect(res).to.be.json;
//                 //     expect(res).to.be.an('object');
//                 //     return token = res.body;
//                 // });
//         })
// }



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

    // describe('GET endpoint', function(){
    //     it('should return all user objects', function(){
    //         let res;
    //
    //         return chai.request(app)
    //             .get('/dashboard/restaurants')
    //             .then(function(_res){
    //                 res = _res;
    //                 console.log('This is the res.body' + res.body);
    //                 expect(res).to.have.status(200);
    //                 expect(res).to.be.json;
    //                 expect(res.body).to.be.an('array');
    //                 expect(res.body).to.have.lengthOf.at.least(1);
    //                 expect(res.body[0]).to.have.all.keys("userName", "restaurants", "_id");
    //                 return Users.count();
    //             })
    //             .then(function(data){
    //                 console.log(data);
    //                 expect(res.body).to.have.lengthOf(data);
    //             });
    //     });
    // });
    // describe('Post user login endpoint', function(){
    //     it('should login existing user', function(){
    //         //findOne user
    //         let user;
    //
    //         return Users
    //             .findOne()
    //             .then(function(_user){
    //                 user = _user;
    //                 console.log(user);
    //                 let userLoginObj = {
    //                     userName: user.userName,
    //                     password: user.password
    //                 }
    //                 console.log(userLoginObj);
    //                 // console.log(type);
    //
    //                 //then send userName and password object to /login endpoint
    //                 return chai.request(app)
    //                     .post('/login')
    //                     .send(userLoginObj)
    //                     .then(function(res){
    //                         console.log(res);
    //                         //expect res to be json
    //                         expect(res).to.be.json;
    //                         //expect res.body to be an object
    //                         // expect(res.body).to.be.an('object');
    //                         // //expect res.body to include keys id, jwt
    //                         // expect(res.body).to.include.keys('id', 'jwt');
    //                         // //expect res.id to equal user._id
    //                         // expect(res.body.id).to.equal(user._id);
    //                     });
    //             });
    //     });
    // });
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
                    console.log("This is the new user" + res.body);
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.include.keys('userName', '_id', 'restaurants');
                    return Users.findById(res.body._id);
                })
                .then(function(user){
                    expect(user).to.not.be.null;
                    expect(user.userName).to.equal(newPost.userName);
                    // expect(user.password).to.equal(newPost.password);
                    expect(user.restaurants).to.not.be.null;
                });
        });
    });
    describe('restaurants create PUT endpoint', function(){
        it('should add a new restaurant to existing user object', function(){
            const newRestaurant = {
                name: faker.company.companyName(),
                address: faker.address.streetAddress()
            }

            return Users
                .findOne()
                .then(function(user){
                    console.log(user);
                    let testAuthToken = createAuthToken(user.forAuthToken());
                    console.log(createAuthToken(user.forAuthToken()));
                    return chai.request(app)
                        .put(`/dashboard/restaurants/${user._id}`)
                        .set('Authorization', `Bearer ${testAuthToken}`)
                        .send(newRestaurant)
                        .then(function(res){
                            expect(res).to.have.status(201);
                            expect(res.body.message).to.equal("Restaurant added!");
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
                    console.log(user);
                    let testAuthToken = createAuthToken(user.forAuthToken());
                    return chai.request(app)
                        .put(`/dashboard/restaurants/edit/${user._id}.${user.restaurants[0]._id}`)
                        .set('Authorization', `Bearer ${testAuthToken}`)
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

    describe('restaurants DELETE endpoint', function(){
        it('should delete existing embedded restaurant document', function(){
            //find one user
            return Users
                .findOne()
                .then(function(user){
                    const restaurantIdToDelete = user.restaurants[0]._id;
                    let testAuthToken = createAuthToken(user.forAuthToken());

                    return chai.request(app)
                        .delete(`/dashboard/restaurants/delete/${user._id}.${user.restaurants[0]._id}`)
                        .set('Authorization', `Bearer ${testAuthToken}`)
                        .then(function(res){
                            expect(res).to.have.status(204);
                            return Users.findById(user._id);
                        })
                        .then(function(userAfterDelete){
                            expect(userAfterDelete.restaurants.id(restaurantIdToDelete)).to.be.null;
                        });
                });
        });
    });

    describe('GET random restaurant endpoint', function(){
        it('should return a random restaurant to the user', function(){
            //findOne user
            return Users
                .findOne()
                .then(function(user){
                    let testAuthToken = createAuthToken(user.forAuthToken());
                    return chai.request(app)
                        .get(`/dashboard/restaurants/random/${user._id}`)
                        .set('Authorization', `Bearer ${testAuthToken}`)
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.not.be.null;
                            //expects correct keys are present
                        });
                });
        });
    });
});
