var passport = require("passport");
var Users = require("./users.js");
var Plans = require("./plans.js");

function ensureAuthenticated(req, res, next)
{
    if (req.isAuthenticated())
        return next();

    res.statusCode = 401;
    res.end();
}

module.exports =
{
	load: function(app)
	{
        // Login, Logout, Account
        app.get("/", function(req, res)
        {
            if(req.isAuthenticated())
                res.render("index", { authenticated: true });
            else
                res.render("index", { authenticated: false });
        });

        app.get("/account", ensureAuthenticated, function(req, res) { res.write("Logged in as: " + req.user.displayName); res.end(); });

        // Google Auth endpoints
		app.get("/auth/google", passport.authenticate("google", { scope: [ "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email" ] }));
		app.get("/auth/google/return", passport.authenticate("google", { successRedirect: "/account", failureRedirect: "/login" }));
        app.get("/auth/logout", function(req, res) { req.logout(); res.redirect("/"); });

        // REST API
        app.get("/api/plans", ensureAuthenticated, function(req, res)
        {
            Plans.findAll(req.user.id).done(function(plans)
            {
                res.json(plans);
            })
        });

        app.post("/api/plans", ensureAuthenticated, function(req, res)
        {
            Plans.addOne(req.body).done(function(result)
            {
                res.json(result);
            })
        });

        app.get("/api/users", ensureAuthenticated, function(req, res)
        {
            Users.findOne(req.params.userId).done(function(user)
            {
                res.json(user);
            })
        });
	}
}
