const assert = require('chai').assert;
const request = require('supertest');
const expect = require('chai').expect;
var chai = require('chai'), chaiHttp = require('chai-http');
const app = require('../server');

var supertest = require('supertest');
var should = chai.should();

chai.use(chaiHttp);
var server = supertest.agent("app");
//


//-------------------Testing Deliverable 1-------------------------//

//Testing Registration
describe('Test Registration Page', function () {
    // should return registration page
    // after(function (done){
    //     server.close();
    //     done();
    // });

    it('Registration test', function (done) {
        chai.request('http://localhost:8080/register')
            .get('/')
            .end(function (err, res) {
                res.status.should.equal(200);
                done();

            });


    });

    //Login Page
    it('Login test', function (done) {
        chai.request('http://localhost:8080/verify')
            .get('/verify')
            .end(function (err, res) {
                res.status.should.equal(200);

            });

        done();

    });
    
    //Profile Page
    it('profile test', function (done) {
        chai.request('http://localhost:8080/profile/lisa')
            .get('/profile/:name')
            .end(function (err, res) {
                res.status.should.equal(200);

            });

        done();

    });
    


});

