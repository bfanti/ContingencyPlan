var passport = require("passport");

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
	}
}