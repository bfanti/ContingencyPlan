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

function authSuccessRedirect(req, res)
{
    res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}

module.exports =
{
	load: function(app)
	{
        // Login, Logout, Account
        app.get("/", function(req, res)
        {
            if(req.isAuthenticated())
                res.render("home", { name: "Bernardo" });
            else
                res.render("index");
        });

        app.get("/app", function(req, res)
        {
            if(req.isAuthenticated())
                res.render("app", { user: req.user });
            else
                res.redirect("/");
        });

        // Google Auth endpoints
		app.get("/auth/google", passport.authenticate("google", { scope: [ "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email" ] }));
		app.get("/auth/google/return", passport.authenticate("google", { failureRedirect: "/login" }), authSuccessRedirect);
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
