(function()
{
    var config = require("./config.json");
    var express = require("express");
    var routes = require("./routes.js");
    var passport = require("passport");
    var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

    var app = express();

    var Users = require("./users.js");

    var baseURLs =
    {
        "LOCAL": "http://127.0.0.1:5000",
        "DEV": "http://contingencyplan.herokuapp.com"
    }

    config.server.env = process.env.ENV || "LOCAL";
    config.server.port = process.env.PORT || config.server.port;
    config.server.public_dir = process.env.PUBLIC_DIR || config.server.public_dir;

    app.configure(function()
    {
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ secret: "keyboard cat" }));
    	app.use(express.favicon());
    	app.use(express.logger("dev"));
        app.use

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);

        routes.load(app);
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
        done(null, user.googleId);
    });

    passport.deserializeUser(function(id, done)
    {
        Users.findOne(id).done(function (user) 
        {
            done(null, user);
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
        Users.findOrCreate(profile).done(function(user)
        {
            done(null, user);
        });
    }));

    app.listen(config.server.port);
})();