var config = require("./config.json");
var express = require("express");
var routes = require("./routes.js");
var passport = require("passport");
var GoogleStrategy = require("passport-google").Strategy;

var app = express();

config.server.port = process.env.PORT || config.server.port;
config.server.public_dir = process.env.PUBLIC_DIR || config.server.public_dir;

app.configure(function()
{
	app.use(express.favicon());
	app.use(express.logger("dev"));

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());

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

passport.use(new GoogleStrategy(
{
    returnURL: "http://contingencyplan.heroku.com/auth/google/return",
    realm: "http://contingencyplan.heroku.com"
},
function(identifier, profile, done)
{
    User.findOrCreate({openId: identifier }, function(err, user)
    {
        done(err, user);
    })
}));

routes.load(app);
app.listen(config.server.port);
console.log("Listening on port " + config.server.port);