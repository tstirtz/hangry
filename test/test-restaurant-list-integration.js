'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL, TEST_DATABASE_URL} = require('../config');


chai.use(chaiHttp);

// function seedTestData(){
//     let seededTestData = [];
//
//     for(let i = 0; i < 10; i++){
//         seededTestData.push(testDataModel());
//     }
//
// }
//
// function testDataModel(){
//     return
//         {
//             userName: faker.internet.userName(),
//             password: faker.internet.password(),
//             restaurantList: [
//                 {
//                     name: faker.company.companyName(),
//                     address: faker.address.streetAddress()
//                 },
//                 {
//                     name: faker.company.companyName(),
//                     address: faker.address.streetAddress()
//                 },
//                 {
//                     name: faker.company.companyName(),
//                     address: faker.address.streetAddress()
//                 },
//                 {
//                     name: faker.company.companyName(),
//                     address: faker.address.streetAddress()
//                 }
//             ]
//         };
// }

// function tearDownTestDb(){
//
// }



describe('Root url GET', function(){
    before(function(){
        runServer(DATABASE_URL)
            .catch(function(err){
                console.log(err);
            })
            .then(function(){
                console.log('success started server');
            })

    });

    // beforEach(function(){
    //     seedTestData();
    // });
    //
    // afterEach(function(){
    //
    // });

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
            expect(res.body).to.have.lengthOf.at.least(2);
        });
    });
});

// describe('Display data to client', function(){
//     it('should return an object', function(){
//         expect(getRestaurantData(renderRestaurantList)).to.be.an('object');
//     });
// });
