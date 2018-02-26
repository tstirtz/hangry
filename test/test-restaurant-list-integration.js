'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {app, runServer, closeServer} = require('../server')

chai.use(chaiHttp);



describe('Root url GET', function(){
    before(function(){
        runServer();
    });

    after(function(){
        closeServer();
    });


    it('should return status code', function(){
        app.get('/', function(req, res){
            expect(res).to.have.status(200);
        });
    });
});
