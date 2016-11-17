var routes = require('./routes/index');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var loginMiddlewere = require('./middlewere/login');
var cookie = require('cookie-parser');

var GLOBALS = require('./config/globals');

var routes = require('./routes/index');
var userRoute = require('./routes/user');

var DB = require('./config/server');

// init app
var app = express();

/*
* Setting port for Server
*/
app.set('port', GLOBALS.PORT);

/*
* Setting View Engine and layout
*/
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

/*
* Exposure public folder to internet
*/
app.use(express.static(path.join(__dirname, 'public')));

/*
* BodyParser Middlewere for JSON and only accpect string or arrays
*/
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

/*
* Express Validator Middlewere 
*/
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

/*
* Setting Middlewares here
*/
app.use('/', routes);
app.use('/user', userRoute);
app.get('*', function (req, res) {
    res.send('nothing 404!');
});

/*
* Start and listen SERVER
*/
app.listen(app.get('port'), function () {

    console.log(`Web Server Started with Port of ${GLOBALS.PORT} !`);
});

