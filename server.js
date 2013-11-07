var config = require("./config.json");
var express = require("express");
var MongoStore = require('connect-mongo')(express);
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var DB = require("./db.js");
var Routes = require("./routes.js");

var Plans = require("./plans.js");
var Users = require("./users.js");
var Scheduler = require("./scheduler.js");

var app = express();

var baseURLs =
{
    "LOCAL": "http://127.0.0.1:5000",
    "DEV": "http://contingencyplan.herokuapp.com"
};

config.server.env = process.env.ENV || "LOCAL";
config.server.port = process.env.PORT || config.server.port;
config.server.public_dir = process.env.PUBLIC_DIR || config.server.public_dir;

DB.initialize().done(startServer);

function startServer(db)
{
    app.controllers =
    {
        plans: new Plans(db),
        users: new Users(db)
    };

    // Instantiate and initialize App Routes
    new Scheduler(db).loadJobsFromDB();

    app.configure(function()
    {
        app.engine('.html', require('ejs').__express);
        app.set("view engine", "html");
        app.set('views', __dirname + '/views');

        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session(
        {
            secret: "crazy secret passphrase to make my cookie secure",
            cookie:
            {
                maxAge: 2629740000
            },
            store: new MongoStore({ db: db })
        }));
        app.use(express.favicon());
        app.use(express.logger("dev"));
        app.use

        app.use(passport.initialize());
        app.use(passport.session());

        new Routes(app);

        app.use(app.router);

        app.use(express["static"](config.server.public_dir));
    });

    app.configure("development", function()
    {
        app.use(express.errorHandler(
        {
            dumpException: true,
            showStack: true
        }));
    });

    passport.serializeUser(function(user, done)
    {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done)
    {
        app.controllers.users.findOne(id).then(function (user) 
        {
            done(null, user);
        }, function(err)
        {
            done(err, null);
        });
    });
    
    passport.use(new GoogleStrategy(
    {
        clientID: "856641313075.apps.googleusercontent.com",
        clientSecret: "fVFd03XmjNr8jNgGy-zPmYqG",
        callbackURL: baseURLs[config.server.env] + "/auth/google/return"
    },
    function(accessToken, refreshToken, profile, done)
    {
        app.controllers.users.findByGoogleProfileOrCreate(profile).done(function(user)
        {
            done(null, user);
        });
    }));

    app.listen(config.server.port);
    console.log("App successfully initialized and started...");
};
