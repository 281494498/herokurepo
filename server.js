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
var engines = require('consolidate');
//var handlebars = require('handlebars');

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

//    app.set('view engine', 'ejs'); // set up ejs for templating TODO
    app.set('views', __dirname+'/views');
    app.set('view engine', 'html');
    app.engine('html', engines.handlebars, function(err, html) {
        if (err) throw err;
        console.log("successful load handlebars engine"); // why there is no log?TODO
    });

// required for passport
    app.use(session({ secret: 'heawen110' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

}

//==========================================================================
//==============================static file system==========================
//==========================================================================

//var http = require('http');
//var parse = require('url').parse;
//var join = require('path').join;
//var fs = require('fs');
//
//var root = __dirname + '/public';

app.use(express.static(__dirname));

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
