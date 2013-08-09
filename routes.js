var passport = require("passport");
var Users = require("./users.js");
var Plans = require("./plans.js");

function ensureAuthenticated(req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports =
{
	load: function(app)
	{
        // Login, Logout, Account
        app.get("/login", function(req, res) { res.write("<a href='auth/google'>Please Log In</a>"); res.end(); });
        app.get("/logout", function(req, res) { req.logout();   res.redirect("/"); });
        app.get("/account", ensureAuthenticated, function(req, res) { res.write("Logged in as: " + req.user.displayName); res.end(); });

        // Google Auth endpoints
		app.get("/auth/google", passport.authenticate("google", { scope: [ "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email" ] }));
		app.get("/auth/google/return", passport.authenticate("google", { successRedirect: "/account", failureRedirect: "/login" }));

        // REST API
        app.get("/api/users/:userId/plans", ensureAuthenticated, function(req, res)
        {
            Plans.findAll(req.params.userId).done(function(plans)
            {
                res.json(plans);
            })
        });

        app.post("/api.users/:userId/plans", ensureAuthenticated, function(req, res)
        {
            console.log(req.body);
        });

        app.get("/api/users", ensureAuthenticated, function(req, res)
        {
            res.json(req.user);
        });

        app.get("/api/users/:userId", ensureAuthenticated, function(req, res)
        {
            Users.findOne(req.params.userId).done(function(user)
            {
                res.json(user);
            })
        });
	}
}