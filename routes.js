var passport = require("passport");

module.exports =
{
	load: function(app)
	{
		app.get("/auth/google", passport.authenticate("google"));
		app.get("/auth/google/return", passport.authenticate("google", { successRedirect: "/", failureRedirect: "/login"}));
	}
}