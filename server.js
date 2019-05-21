const express = require('express');
const cookeParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const hbs = require('hbs');
const utils = require('./utils');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const request = require('request');
var exphbs = require('express-handlebars');

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
        var a = Math.floor(Math.random() * 11) + 5;
        var b = Math.floor(Math.random() * 11) + 5;
        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];

        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};
const getMath2 = async () => {
    try {
        var a = Math.floor(Math.random() * 20) + 10;
        var b = Math.floor(Math.random() * 20) + 10;

        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];

        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};

const getMath3 = async () => {
    try {
        var a = Math.floor(Math.random() * 5) + 2;
        var b = Math.floor(Math.random() * 5) + 2;

        var op = ["*", "+", "-"][Math.floor(Math.random()*3)];

        return {'a':a, 'b':b, 'op':op}
    } catch (error) {
        console.log('Error');
    }
};

var user_name;
var question, question_result;
var question2, question_result2;
var question3, question_result3;
var n = 1;
var t = 1;
var e = 1;
var hard_correct = 0;
var normal_correct = 0;
var easy_correct = 0;

//EASY LEVEL MATH QUESTIONS
app.post('/easy_gameplay',(req, res) =>{

    getMath3().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question3 = "What is " + a + " " + op + " " + b + "?";
        question_result3 = eval(a + op + b);

        res.render('easy_game.hbs',{
            calculation: question3
        });
    }).catch((error) => {
        res.render('easy_game.hbs', {
            calculation: `Error message: ${error}`
        });
    });

});


app.post('/math_easy_answer/:name',(req, res) =>{
    var answer = parseInt(req.body.answer);

    //user_name = request.params.name;

    if (answer === question_result3){

        getMath3().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question_new = "What is " + a + " " + op + " " + b + "?";
            e += 1;
            question_result_new = eval(a + op + b);
            question_result3 = question_result_new;
            easy_correct +=1;

            res.render('easy_game.hbs',{
                result: "CORRECT",
                username: user_name,
                calculation: question_new
            })
        })
    }else {
        getMath3().then((result) => {
            var a = result.a, b = result.b, op = result.op;
            var question = "What is " + a + " " + op + " " + b + "?";
            e += 1;

            question_result_new = eval(a + op + b);
            question_result3 = question_result_new;

            res.render('easy_game.hbs', {
                result2: "WRONG",
                username: user_name,
                nextquestion: question,
                //correct_answer: `The correct answer is ${correct_answer}`
            })
        })
    }
    var db = utils.getDb();
    const alreadyExisting = db.collection("registration").findOne({username: user_name });

    if (e%5 === 0 && e > 1) {
        //time += 1;
        res.redirect(`/easy_game_end/${user_name}`);
        var db = utils.getDb();

        if (alreadyExisting){
            db.collection('registration').findOne({username: user_name}, function(err, user) {
                console.log(user.easy_score);
                if (easy_correct > user.easy_score) {
                    db.collection('registration').updateOne({username: user_name}, {
                        $set: {easy_score: easy_correct}
                    })
                }
            })
        }

    }
});

app.post('/easy_game_end',(req, res) =>{

    res.redirect(`/easy_mathgame/${user_name}`);
    easy_correct = 0
});
//END EASY LEVEL MATH QUESTIONS

//NORMAL LEVEL MATH QUESTIONS
app.post('/gameplay',(req, res) =>{

    getMath().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question = "What is " + a + " " + op + " " + b + "?";
        question_result = eval(a + op + b);
        // n += 1;
        console.log("Question",n);

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
            console.log("N =",n);
            question_result_new = eval(a + op + b);
            question_result = question_result_new;
            normal_correct +=1;
            console.log("Normal_correct",normal_correct);

            res.render('game.hbs',{
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
            question_result_new = eval(a + op + b);
            question_result = question_result_new;

            res.render('game.hbs', {
                result2: "WRONG",
                username: user_name,
                nextquestion: question,
                //correct_answer: `The correct answer is ${correct_answer}`
            })
        })
    }
    var db = utils.getDb();
    const alreadyExisting = db.collection("registration").findOne({username: user_name });

    if (n%10 === 0 && n > 1) {
        res.redirect(`/normal_game_end/${user_name}`);
        var db = utils.getDb();

        if (alreadyExisting){
            db.collection('registration').findOne({username: user_name}, function(err, user) {
                console.log(user.normal_score)
                if (normal_correct > user.normal_score) {
                    db.collection('registration').updateOne({username: user_name}, {
                        $set: {normal_score: normal_correct}
                    })
                }
            })
        }
    }
});

app.post('/normal_game_end',(req, res) =>{

    res.redirect(`/mathgame/${user_name}`);
    normal_correct = 0
});
//END NORMAL DIFFICULTY LEVEL MATH QUESTIONS


//HARD DIFFICULT LEVEL MATH QUESTIONS
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

            res.render('game2.hbs',{
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

            res.render('game2.hbs', {
                result2: "WRONG",
                username: user_name,
                nextquestion: question,

                //correct_answer: `The correct answer is ${question_result2}`
            })
        })
    }
    var db = utils.getDb();
    const alreadyExisting = db.collection("registration").findOne({username: user_name });
    if (t%15 === 0 && t > 1) {

        res.redirect(`/hard_game_end/${user_name}`);
        var db = utils.getDb();

        if (alreadyExisting){
            db.collection('registration').findOne({username: user_name}, function(err, user) {
                console.log(user.hard_score)
                if (hard_correct > user.hard_score) {
                    db.collection('registration').updateOne({username: user_name}, {
                        $set: {hard_score: hard_correct}
                    })
                }
            })
        }
    }
});

app.post('/hard_game_end',(req, res) =>{

    res.redirect(`/mathgame2/${user_name}`);
    hard_correct = 0
});
//END HARD DIFFICULT LEVEL MATH QUESTIONS

//EASY GAME GET ENDPOINT
app.get('/easy_mathgame/:name', (request, response) => {

    user_name = request.params.name;

    getMath3().then((result) => {
        var a = result.a, b = result.b, op = result.op;
        question3 = "What is " + a + " " + op + " " + b + "?";
        question_result3 = eval(a + op + b);

        response.render('easy_game.hbs',{
            calculation: question3,
            title: 'Math Game',
            username: user_name,
            head: 'Welcome To The Game Center',
        });
    }).catch((error) => {
        console.log(error)
    });

});

app.get(`/easy_game_end/:name`, (request, response) => {

    user_name = request.params.name;

    response.render('easy_game_end.hbs', {
        title: 'GameEnd Page',
        username: user_name,
        total: `You Got ${easy_correct}/5`
    });
});
//END EASY GAME GET ENDPOINT

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
        total: `You Got ${normal_correct}/10`
    });
});
//END OF NORMAL GAME GET ENDPOINT

//HARD GAME GET ENDPOINT
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
    user_name = request.params.name;

    response.render('hard_game_end.hbs', {
        title: 'GameEnd Page',
        username: user_name,
        total: `You Got ${hard_correct}/15`
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
    var email = req.body.email;
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
                    email: email,
                    username: username,
                    password: password2,
                    password2: password2,
                    easy_score: '',
                    normal_score: '',
                    hard_score: '',

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
                // res.render('welcome.hbs', {
                //     username: username
                // });
                // res.redirect(`/welcome/${username}`)
                res.redirect(`/phone/${username}`);
            }else {
                res.render('login.hbs', {
                    text: "The username or password you entered is incorrect"
                });
            }
        });
    }
});

//2 STEP AUTHENTICATION

//Load and initialize MessageBird SDK
var messagebird = require('messagebird')('h5kgtCqXjpujk06vSmtWopwEK'); //Input message bird key here

//Set up and configure the Express framework
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Display page to ask the user their phone number
app.get('/phone/:name', function(req, res) {
    var user_name = req.params.name;

    res.render(`step1`, {
        username: user_name
    });
});

//Handle phone number submission
app.post('/step2/:name', function(req, res) {
    var number = req.body.number;
    var user_name = req.params.name;

    //Make request to verify API
    messagebird.verify.create(number, {
        template: "Your verification code is %token."
    },function (err, response) {
        if(err) {
            //Request has failed
            console.log(err);
            res.render(`step1`,{
                error: err.errors[0].description,
                username: user_name
            });
        }
        else{
            //Request succeeds
            console.log(response);
            res.render(`step2`,{
                id: response.id,
                username: user_name
            });
        }
    })
});

//Verify whether the token is correct

app.post('/step3/:name', function(req, res) {
    var id = req.body.id;
    var token = req.body.token;
    var user_name = req.params.name;

    //Make request to verify API
    messagebird.verify.verify(id, token, function(err, response ) {
        if(err){
            //Verification has failed
            res.render('step2', {
                error: err.errors[0].description,
                id: id
            })
        } else {
            //Verification was succe${username}
            res.redirect(`/welcome/${user_name}`)
        }
    })
});

//END 2 step auth



// USER WELCOME PAGE AND PROFILE
app.get('/welcome/:name', (request, response) => {

    var user_name = request.params.name;

    response.render('welcome.hbs', {
        title: 'Welcome Page',
        username: user_name,
    })
});

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
        }else if(user_name === undefined){
            response.render('user_fail.hbs',{
                title: 'User Fail',
            })
        }
        response.render('user.hbs', {
            title: 'User Profile',
            username: docs[0].username,
            first_name: docs[0].fname,
            last_name: docs[0].lname,
            email: docs[0].email,
            easy_score: docs[0].easy_score,
            normal_score: docs[0].normal_score,
            hard_score: docs[0].hard_score
        })

    })

});
//END USER WELCOME PAGE AND PROFILE

//************START LEADERBOARD CODE******************
app.get(`/easy_leaderboard/:name`, (request, response) => {

    var user_name = request.params.name;

    var db = utils.getDb();
    db.collection('registration').find({}).toArray((err,docs) => {
        if (err) {
            return console.log("Unable to get all user");
        }

        console.log(docs);

        var i;
        var array = [];
        for (i = 0; i < docs.length; i++) {
            var object = [];

            object.push(docs[i].username);
            object.push(docs[i].easy_score);
            array.push(object);
        }

        array.sort(function(a, b)
        {
            return a[1] - b[1];
        });

        console.log(array);

        var first = array[array.length - 1][0] + ' (Score '+ array[array.length - 1][1] +")";
        var second = array[array.length - 2][0] + ' (Score '+ array[array.length - 2][1]+")";
        var third = array[array.length - 3][0] + ' (Score '+ array[array.length - 3][1]+")";
        var fourth = array[array.length - 4][0] + ' (Score '+ array[array.length - 4][1]+")";
        var fifth = array[array.length - 5][0] + ' (Score '+ array[array.length - 5][1]+")";


        response.render('easy_leaderboard.hbs',{
            first: first,
            second: second,
            third: third,
            fourth: fourth,
            fifth: fifth,
            username: user_name

        })
    })
});


app.get(`/normal_leaderboard/:name`, (request, response) => {

    var user_name = request.params.name;

    var db = utils.getDb();
    db.collection('registration').find({}).toArray((err,docs) => {
        if (err) {
            return console.log("Unable to get all user");
        }

        console.log(docs);

        var i;
        var array = [];
        for (i = 0; i < docs.length; i++) {
            var object = [];

            object.push(docs[i].username);
            object.push(docs[i].normal_score);
            array.push(object);
        }

        array.sort(function(a, b)
        {
            return a[1] - b[1];
        });

        console.log(array);

        var first = array[array.length - 1][0] + ' (Score '+ array[array.length - 1][1] +")";
        var second = array[array.length - 2][0] + ' (Score '+ array[array.length - 2][1]+")";
        var third = array[array.length - 3][0] + ' (Score '+ array[array.length - 3][1]+")";
        var fourth = array[array.length - 4][0] + ' (Score '+ array[array.length - 4][1]+")";
        var fifth = array[array.length - 5][0] + ' (Score '+ array[array.length - 5][1]+")";


        response.render('normal_leaderboard.hbs',{
            first: first,
            second: second,
            third: third,
            fourth: fourth,
            fifth: fifth,
            username: user_name

        })
    })
});

app.get(`/hard_leaderboard/:name`, (request, response) => {

    var user_name = request.params.name;

    var db = utils.getDb();
    db.collection('registration').find({}).toArray((err,docs) => {
        if (err) {
            return console.log("Unable to get all user");
        }

        console.log(docs);

        var i;
        var array = [];
        for (i = 0; i < docs.length; i++) {
            var object = [];

            object.push(docs[i].username);
            object.push(docs[i].hard_score);
            array.push(object);
        }

        array.sort(function(a, b)
        {
            return a[1] - b[1];
        });

        console.log(array);

        var first = array[array.length - 1][0] + ' (Score '+ array[array.length - 1][1] +")";
        var second = array[array.length - 2][0] + ' (Score '+ array[array.length - 2][1]+")";
        var third = array[array.length - 3][0] + ' (Score '+ array[array.length - 3][1]+")";
        var fourth = array[array.length - 4][0] + ' (Score '+ array[array.length - 4][1]+")";
        var fifth = array[array.length - 5][0] + ' (Score '+ array[array.length - 5][1]+")";


        response.render('hard_leaderboard.hbs',{
            first: first,
            second: second,
            third: third,
            fourth: fourth,
            fifth: fifth,
            username: user_name

        })
    })


});

//************END LEADERBOARD CODE******************

app.post('/logout', function (req, res, next) {
    user_name = ""
    res.redirect('/')
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



