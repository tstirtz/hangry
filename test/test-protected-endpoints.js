'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY} = require('../config');
const {Users} = require('../models/user-model');
const jwt = require('jsonwebtoken');
const {createAuthToken} = require('../auth/router');

const expect = chai.expect;
chai.use(chaiHttp); //allows me to make http requests in my tests

describe('Auth endpoints', function(){
    const pass = 'examplePass';
    let userId;
    let testUserId;

    before(function(){
        return runServer(TEST_DATABASE_URL);
    });
    after(function(){
        closeServer();
    });
    beforeEach(function(){
        // return Users.hashPassword(pass).then(hashedPassword =>
        //     Users.create({
        //         userName: 'exampleUser',
        //         password: hashedPassword
        //     })
        // );

        const testUser = {
            userName: 'exampleUser',
            password: 'examplePass'
        }

        return chai.request(app)
            .post('/user-account')
            .send(testUser)
            .then((res) => {
                testUserId = res.body._id;
            });
    });
    afterEach(function(){
        return Users.remove({});
    });

    describe('/dashboard/restaurants/:id', function(){
        it('Should reject a request with no credentials', function(){
            // return Users.findOne({})
            //     .then(user => {
            //         userId = user._id;
            //         console.log(userId);
            //         return chai.request(app)
            //             .get(`/dashboard/restaurants/${userId}`)
            //             .then(() =>
            //                 expect.fail(null, null, 'Request should not succeed')
            //             )
            //             .catch(err =>{
            //                 if(err instanceof chai.AssertionError){
            //                     throw err;
            //                 }
            //
            //                 const res = err.response;
            //                 expect(res).to.have.status(401);
            //             });
            //     });
            return chai.request(app)
                .get(`/dashboard/restaurants/${testUserId}`)
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err =>{
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should reject a request with an invalid token', function(){
            const token = jwt.sign(
                {
                    userName: 'exampleUser',
                    password: 'examplePass'
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );

            return chai.request(app)
                .get(`/dashboard/restaurants/${testUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .then(()=>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err =>{
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should reject request with an expired token', function(){
            const token = jwt.sign(
                {
                    user:{
                        userName: 'exampleUser',
                        password: 'examplePass'
                    },
                    exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
                },
                JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: 'exampleUser'
                }
            );

            return chai.request(app)
                .get(`/dashboard/restaurants/${testUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .then(()=>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if(err instanceof chai.AssertionError){
                        throw err
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should send protect data', function(){
            const token = jwt.sign(
                {
                    userName: 'exampleUser',
                    _id: `${testUserId}`
                },
                JWT_SECRET,
                {
                    subject: 'exampleUser',
                    expiresIn: JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );
            return Users.findOne({})
                .then(user => {
                    let testAuthToken = createAuthToken(user.forAuthToken());
                    return chai.request(app)
                        .get(`/dashboard/restaurants/${testUserId}`)
                        .set('Authorization', `Bearer ${testAuthToken}`)
                        .then(res => {
                            console.log(res.body);
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('array');
                        });
                });
        });
    });
});
