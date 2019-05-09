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

/*function isAuthenticated(request, response, next) {
    if (request.session.passport !== undefined) {
        console.log(request.session.passport);
        next();
    } else {
        response.render('home.hbs', {
            title: 'Home Page',
            head: 'Can You Math?'
        });
    }
}*/

function startCountdown(seconds){
    var counter = seconds;

    var interval = setInterval(() => {
        console.log(counter);
    counter--;

    if(counter < 0 ){
        clearInterval(interval);
        console.log('Game Over');
    }
}, 1000);
}


// const getMath = async () => {
//     try {
//         var a = Math.floor(Math.random() * 10) + 1;
//         var b = Math.floor(Math.random() * 10) + 1;
//         var op = ["*", "+", "/", "-"][Math.floor(Math.random()*4)];
//         return {'a':a, 'b':b, 'op':op}
//     } catch (error) {
//         console.log('Error');
//     }
// };


const getMath = async () => {
    try {
        var a = Math.floor(Math.random() * 10) + 1;
        var b = Math.floor(Math.random() * 10) + 1;
        // var a = 10;
        // var b = 2;
        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];


        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};


var question, question_result;


app.post('/gameplay',(req, res) =>{

    getMath().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question = "How much is " + a + " " + op + " " + b + "?";
        question_result = eval(a + op + b);

        res.render('game.hbs',{
            calculation: question
        });
    }).catch((error) => {
        res.render('game.hbs', {
            calculation: `Error message: ${error}`
        });
    });

});

app.post('/math_answer',(req, res) =>{
    var answer = parseInt(req.body.answer);
    var correct, wrong;

    if (answer === question_result){

        getMath().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question_new = "How much is " + a + " " + op + " " + b + "?";
            question_result_new = eval(a + op + b);
            question_result = question_result_new;
            correct_answer = eval(a + op + b);

            res.render('game',{
                result: "correct",
                calculation: question_new
            })
        })
    }else {

        getMath().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question = "How much is " + a + " " + op + " " + b + "?";
            question_result_new = eval(a + op + b);
            question_result = question_result_new;


            res.render('game', {
                result: "wrong",
                nextquestion: question,

                correct_answer: `The correct answer is ${correct_answer}`
            })
        })
    }
});


app.get('/mathgame', (request, response) => {

    response.render('game.hbs', {
        title: 'Math Game',
        head: 'Welcome To The Game Center',
    });

});

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
                });            }else if(user.username === req.body.username && user.password === req.body.password) {
                res.render('welcome.hbs', {
                    username: username
                });
            }else {
                res.render('login.hbs', {
                    text: "The username or password you entered is incorrect"
                });
            }
            //authenticate = req.session.userId = user._id
        });
    }
});

// USER PROFILE
app.get(`/profile/:name`, (request, response) => {

    var db = utils.getDb();
    var user_name = request.params.name;
    db.collection('registration').find({username: user_name}).toArray((err,docs) => {
        if (err) {
            console.log("Unable to get user");
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

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
    utils.init();

});
