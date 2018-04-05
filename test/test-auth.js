'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const {Users} = require('../models/user-model');
const jwt = require('jsonwebtoken');

const expect = chai.expect;
chai.use(chaiHttp); //allows me to make http requests in my tests

describe('Auth endpoints', function(){
    const pass = 'examplePass';
    let testUserId;
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });
    after(function(){
        closeServer();
    });
    beforeEach(function(){

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

    describe('/login endpoint', function(){
        it('Should reject a request with no credentials', function(){
            return chai.request(app)
            // When passing an app to request; it will automatically open the server for incoming requests (by calling listen()) and, once a request has been made the server will automatically shut down (by calling .close())
                .post('/login')
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err =>{
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                });
        });
        it('Should reject request with incorrect usernames', function(){
            return chai.request(app)
                .post('/login')
                .send({userName: 'wrongUsername', password: pass})
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should reject request with incorrect passwords', function(){
            return chai.request(app)
                .post('/login')
                .send({userName: 'exampleUser', password: 'wrongPassword'})
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if(err instanceof chai.AssertionError){
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should return valid auth token', function(){
            return chai.request(app)
                .post('/login')
                .send({userName: 'exampleUser', password: 'examplePass'})
                .then(res => {
                    console.log(res.body);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    const token = res.body.jwt;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    console.log(payload.user);
                    expect(payload.user).to.deep.equal({
                        userName: 'exampleUser',
                        _id: testUserId
                    });
                });
        });
    });
});
