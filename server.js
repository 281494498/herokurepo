var express = require("express");
var logfmt = require("logfmt");
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');

var configDB = require('./config/database.js');

//--------------------configuration------------------------
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


if ('development' === app.get('env')) {
// set up our express application
    app.use(logfmt.requestLogger()); //another logger other than morgan
    app.use(logger('dev')); // set the logger
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser()); // get information from html forms

    app.set('view engine', 'ejs'); // set up ejs for templating TODO

// required for passport
    app.use(session({ secret: 'heawen110' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

}

//app.use(express.static(__dirname + '/public'));

// app.get('/' , function(request, response){
//       response.redirect('/index.html');
//    });
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
var port = Number(process.env.PORT || 1337);

app.listen(port, function() {
  console.log("Listening on " + port);
});
