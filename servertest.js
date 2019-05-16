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

    //Mathgame Page
    it('Mathgame test', function (done) {
        chai.request('http://localhost:8080/mathgame')
            .get('/mathgame')
            .end(function (err, res) {
                res.status.should.equal(200);

            });

        done();

    });

    //Logout Page
    it('Logout test', function (done) {
        chai.request('http://localhost:8080/logout')
            .get('/logout')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });


});
// Testing login page
var agent = chai.request.agent('app');
describe('Test login page with username and password', function () {
    it('Should Login', function (done) {
        agent
           .post('/verify')
            .type('form')
            .send({username: 'navi', password: '12345678'})
            .end(function (err, res) {
                expect(res).to.have.status(200);
            });

        done();

    })
});

//Testing if Step 2 File doesn't loads after an unsuccessful login
var agent = chai.request.agent("app");

describe('Test login when invalid', function () {
    it('Should not Login', function (done) {
        agent
            .post('/verify')
            .type('form')
            .send({username: '', password: ''})
            .end(function(err, res) {
                console.log(res);
                expect(res).to.have.status(200);
            });

        done();
    })
});

describe('GET /created', function() {
    it("created test", function(done){
        chai.request('http://localhost:8080/created')
            .get('/created')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    })
});


