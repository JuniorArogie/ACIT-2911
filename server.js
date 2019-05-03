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

function isAuthenticated(request, response, next) {
    if (request.session.passport !== undefined) {
        console.log(request.session.passport);
        next();
    } else {
        response.render('home.hbs', {
            title: 'Home Page',
            head: 'Can You Math?'


        });
    }
}

var ID;

app.get('/mathgame', isAuthenticated, (request, response) => {
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
    var text = req.body.text;

    req.checkBody('fname', 'First Name is required').notEmpty();
    req.checkBody('lname', 'Last Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password does not match').equals(req.body.password);
    req.checkBody('password', 'Password cannot be less than 8 characters').isLength({ min: 8, max:20 });


    const errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
        res.redirect('/register');
    }else{
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

                }, (err, result) => {
                    if (err){
                        res.redirect('/register');
                    }else {
                        //req.session.userId = user._id
                        // ID = user._id;
                        res.redirect('/created');
                    }
                });
            }else {
                res.end("Username already exists")
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
                res.end('Invalid User');
            }else if(user.username === req.body.username && user.password === req.body.password) {
                res.render('welcome.hbs', {
                    username: username
                });
            }else {
                res.end("The username or password you entered is incorrect")
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

app.get('/board', (request, response) => {
    response.render('board.hbs', {
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

