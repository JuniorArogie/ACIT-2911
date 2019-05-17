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
        chai.request('http://localhost:8080/profile/navi')
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
// // // Testing login page
// var agent = chai.request.agent('app');
// describe('Test login page with username and password', function () {
//     it('Should Login', function (done) {
//         agent
//             .post('/verify')
//             .type('form')
//             .send({username: 'navi', password: '12345678'})
//             .end(function (err, res) {
//                 expect(res).to.have.status(200);
//             });
//
//         done();
//
//     })
// });

//Testing if Step 2 File doesn't loads after an unsuccessful login
// var agent = chai.request.agent("app");
//
// describe('Test login when invalid', function () {
//     it('Should not Login', function (done) {
//         agent
//             .post('/verify')
//             .type('form')
//             .send({username: '', password: ''})
//             .end(function(err, res) {
//                 console.log(res);
//                 expect(res).to.have.status(200);
//             });
//
//         done();
//     })
// });

// user created successfully
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

// easy gameplay
describe('easy gameplay ', function() {
    it("easy game", function(done){
        chai.request('http://localhost:8080/easy_mathgame/navi')
            .get('/easy_gameplay')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

    //end of easy game
    it('easy game end ', function (done) {
        chai.request('http://localhost:8080/easy_game_end/navi')
            .get('/easy_game_end/:name')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    })
});


// NORMAL GAME ENDPOINT
describe('normal gameplay ', function() {
    it("normal game", function (done) {
        chai.request('http://localhost:8080/mathgame/navi')
            .get('/mathgame/:name')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

    //end of normal game
    it('normal game end ', function (done) {
        chai.request('http://localhost:8080/easy_game_end/navi')
            .get('/normal_game_end/:name')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    })

});

// HARD GAME ENDPOINT
describe('hard gameplay ', function() {
    it("hard game", function (done) {
        chai.request('http://localhost:8080/mathgame2/navi')
            .get('/mathgame2/:name')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

    //end of normal game
    it('hard game end ', function (done) {
        chai.request('http://localhost:8080/hard_game_end/navi')
            .get('/hard_game_end/:name')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    })

});

// Easy Leader board
describe('easy leaderboard ', function() {
    it("hard game", function (done) {
        chai.request('http://localhost:8080/easy_leaderboard/navi')
            .get('/leaderboard_easy')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

});

// Hard Leaderboard

describe('Hard leaderboard ', function() {
    it("hard game", function (done) {
        chai.request('http://localhost:8080/hard_leaderboard/navi')
            .get('/leaderboard_hard')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

});

// Normal Leaderboard

describe('Normal leaderboard ', function() {
    it("hard game", function (done) {
        chai.request('http://localhost:8080/normal_leaderboard/navi')
            .get('/leaderboard')
            .end(function (err, res) {
                res.status.should.equal(200);
            });

        done();

    });

});







