const express = require('express');
const cookeParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const hbs = require('hbs');
const utils = require('./utils');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const request = require('request');


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookeParser());

app.use(
    session({
        secret: 'junior',
        resave: true,
        saveUninitialized: false
        // store: new MongoStore(
        //     {mongooseConnection: db
        //     })
    }));

app.use(expressValidator());


app.get('/', (request, response) => {
    //console.log(request.session);
    response.render('home.hbs', {
        title: 'Home Page',
        head: 'Can You Math?'


    });
});


const getMath = async () => {
    try {
        var a = Math.floor(Math.random() * 10) + 1;
        var b = Math.floor(Math.random() * 10) + 1;
        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];

        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};
var user_name;
var question, question_result;
var n = 1;
var t = 1;
var hard_correct = 0;
var normal_correct = 0;


//EASY LEVEL MATH QUESTION


app.post('/gameplay',(req, res) =>{


    getMath().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question = "What is " + a + " " + op + " " + b + "?";
        question_result = eval(a + op + b);
        // n += 1;
        // console.log(n);

        res.render('game.hbs',{
            calculation: question
        });
    }).catch((error) => {
        res.render('game.hbs', {
            calculation: `Error message: ${error}`
        });
    });

});


app.post('/math_answer/:name',(req, res) =>{
    var answer = parseInt(req.body.answer);

    //user_name = request.params.name;

    if (answer === question_result){

        getMath().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question_new = "What is " + a + " " + op + " " + b + "?";
            n += 1;
            console.log("Right",n);
            question_result_new = eval(a + op + b);
            question_result = question_result_new;
            normal_correct +=1;
            console.log(normal_correct);

            res.render('game',{
                result: "CORRECT",
                username: user_name,
                calculation: question_new
            })
        })
    }else {

        getMath().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question = "What is " + a + " " + op + " " + b + "?";
            n += 1;
            console.log(n);
            question_result_new = eval(a + op + b);
            question_result = question_result_new;

            res.render('game', {
                result2: "WRONG",
                username: user_name,
                nextquestion: question,
                //correct_answer: `The correct answer is ${correct_answer}`
            })
        })
    }

    var time = 0;
    if (n%5 === 0 && n > 1) {
        time += 1;
        res.redirect(`/normal_game_end/${user_name}`);
        console.log(user_name);
        console.log(normal_correct);
        if (n > 5) {
        normal_correct = normal_correct - time*5;}

    }

});

//DIFFICULT LEVEL MATH QUESTIONS

const getMath2 = async () => {
    try {
        var a = Math.floor(Math.random() * 20) + 2;
        var b = Math.floor(Math.random() * 20) + 2;

        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];

        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};

var question2, question_result2;

app.post('/gameplay2',(req, res) =>{

    getMath2().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question2 = "What is " + a + " " + op + " " + b + "?";
        question_result2 = eval(a + op + b);

        res.render('game2.hbs',{
            calculation: question2
        });
    }).catch((error) => {
        res.render('game2.hbs', {
            calculation: `Error message: ${error}`
        });
    });

});

app.post('/math2_answer/:name',(req, res) =>{

    var answer = parseInt(req.body.answer);

    if (answer === question_result2){

        getMath2().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question_new2 = "What is " + a + " " + op + " " + b + "?";
            t += 1;
            question_result_new = eval(a + op + b);
            question_result2 = question_result_new;
            hard_correct +=1;

            res.render('game2',{
                result: "CORRECT",
                username: user_name,
                calculation: question_new2
            })
        })
    }else {

        getMath2().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question = "What is " + a + " " + op + " " + b + "?";
            t += 1;
            question_result_new = eval(a + op + b);
            question_result2 = question_result_new;


            res.render('game2', {
                result2: "WRONG",
                username: user_name,
                nextquestion: question,

                //correct_answer: `The correct answer is ${question_result2}`
            })
        })
    }

    var time = 0;
    if (t%5 === 0 && t > 1) {
        time += 1;
        res.redirect(`/hard_game_end/${user_name}`);
        console.log(hard_correct);
        if (t > 5) {
            hard_correct = hard_correct - time*5;}

    }
});

//END OF ALL GAME CODE

//NORMAL GAME GET ENDPOINT
app.get('/mathgame/:name', (request, response) => {

    user_name = request.params.name;

    getMath().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question = "What is " + a + " " + op + " " + b + "?";
        question_result = eval(a + op + b);
        // n += 1;
        // console.log(n);

        response.render('game.hbs',{
            calculation: question,
            title: 'Math Game',
            username: user_name,
            head: 'Welcome To The Game Center',
        });
    }).catch((error) => {
        console.log(error)
    });

});

app.get(`/normal_game_end/:name`, (request, response) => {

    user_name = request.params.name;

    response.render('normal_game_end.hbs', {
        title: 'GameEnd Page',
        username: user_name,
        total: `You Got ${normal_correct}/5`


    });
});
//END OF NORMAL GAME GET ENDPOINT

//HARD GAME  GET ENDPOINT
app.get('/mathgame2/:name', (request, response) => {

    user_name = request.params.name;


    getMath2().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question2 = "What is " + a + " " + op + " " + b + "?";
        question_result2 = eval(a + op + b);

        response.render('game2.hbs',{
            calculation: question2,
            username: user_name,
            title: 'Math Game',

        });
    }).catch((error) => {
        console.log(error)
    });

});

app.get('/hard_game_end/:name', (request, response) => {
    //console.log(request.session);
    user_name = request.params.name;

    response.render('hard_game_end.hbs', {
        title: 'GameEnd Page',
        username: user_name,
        total: `You Got ${hard_correct}/10`


    });
});
//END OF HARD GAME GET ENDPOINT


app.get('/created', (request, response) => {
    response.render('created.hbs', {
        title: 'created',
        head: 'User has been created',
    })
});

app.post('/register', function(req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    if (password.length < 8){
        res.render('add.hbs', {
            text: "Password must have at least 8 characters "
        });
    }
    else if (password !== password2) {
        res.render('add.hbs', {
            text: "Passwords do not match"
        });
    }
    else {
        req.session.success = true;

        var db = utils.getDb();

        db.collection('registration').findOne({username: req.body.username}, function(err, user) {
            if (user == null){
                db. collection('registration').insertOne({
                    fname: fname,
                    lname: lname,
                    username: username,
                    password: password2,
                    password2: password2,

                }, (err) => {
                    if (err){
                        res.end(err);
                    }else {
                        res.render('add.hbs', {
                            text2: "User has been created"
                        });
                    }
                });
            }else {
                res.render('add.hbs', {
                    text: "Username already exists"
                });

            }
        })
    }
});

app.post('/verify', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
        res.redirect('/verify');
    }else{
        req.session.success = true;

        var db = utils.getDb();
        db.collection('registration').findOne({username: req.body.username}, function(err, user) {
            if (user === null){
                res.render('login.hbs', {
                    text: "Invalid User"
                });
            }else if(user.username === req.body.username && user.password === req.body.password) {
                res.render('welcome.hbs', {
                    username: username
                });
            }else {
                res.render('login.hbs', {
                    text: "The username or password you entered is incorrect"
                });
            }
        });
    }
});

// USER PROFILE
app.get(`/profile/:name`, (request, response) => {

    var user_name = request.params.name;

    if(user_name === undefined) {
        response.render('404.hbs', {
            title: 'User Fail',
        });
    }

    var db = utils.getDb();
    db.collection('registration').find({username: user_name}).toArray((err,docs) => {
        if (err) {
            console.log("Unable to get user");
        }else if(username === undefined){
            response.render('user_fail.hbs',{
                title: 'User Fail',
            })
        }
        response.render('user.hbs', {
            title: 'User Profile',
            username: docs[0].username,
            first_name: docs[0].fname,
            last_name: docs[0].lname
        })

    })

});


app.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});



app.get('/register', (request, response) => {
    response.render('add.hbs', {
        title: 'Register',

    })
});

app.get('/verify', (request, response) => {
    response.render('login.hbs', {
        title: 'Login',

    })
});


app.get('*', (request, response) => {
    response.render('404.hbs', {
        title: '404 Error',
        head: 'Oops! 404',
        error: 'Page Not Found'
    })
});

app.get('/profile/*', (request, response) => {
    response.render('404.hbs', {
        title: '404 Error',
        head: 'Oops! 404',
        error: 'Page Not Found'
    })
});


app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    utils.init();

});