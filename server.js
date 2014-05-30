//=====================setup express==============

var express = require("express");
var app = express();
var http = require('http');
app.use(express.static(__dirname));

//======================external library===========

var logfmt = require("logfmt");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var engines = require('consolidate');
//var handlebars = require('handlebars'); it is embedded into solidates

//=======================config internal library===============
// ======database
var configDB = require('./config/database.js');

// ======user auth part
require('./config/passport')(passport); // pass passport for configuration

// ======routes
//var router = require('./app/routes.js'); // load our routes and pass in our app and fully configured passport

//router.configRouter(app, passport, server, flash);

// ======test module
search = require('./config/search');  //should automatically give feedback
crud = require('./config/crud');    // shoudl not be here

var Path            = require('./app/models/path');

//crud.create(Path, {start :'stuttgart', end : 'heidelberg'}, function(result){
//    console.dir(result);
//    console.log(result.start + 'this is callback');
//});

//Path.find({ start: /stuttgart/i }, 'start end', function (err, docs) {console.dir(docs); });
//Path.find({ start: /stuttgart/i }, 'date', function (err, docs) {
//    var myDate =  new Date();
//    docs = myDate;
//    console.log('time is'+docs.getTime()
//    + 'day is' +docs.toDateString());
//});
//Path.findOneAndRemove({ start: /stuttgart/i }, null, function(err, docs){console.dir(docs)}); // executes



//--------------------configuration------------------------
mongoose.connect(configDB.url); // connect to our database
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('*** connect to MongoDb***');
});
//TODO config should be change to other place


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

var server = http.createServer(app);
require('./app/routes')(app, passport, server);
//==========================================================================
//==============================static file system==========================
//==========================================================================

//var http = require('http');
//var parse = require('url').parse;
//var join = require('path').join;
//var fs = require('fs');
//
//var root = __dirname + '/public';

// app.get('/' , function(request, response){
//       response.redirect('/index.html');
//    });

// =======================launch ========================
var port = Number(process.env.PORT || 1337);

server.listen(port, function() {
  console.log("Listening on " + port);
});
