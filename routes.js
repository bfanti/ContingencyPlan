var _ = require("underscore");
var passport = require("passport");

var initialized = false;

var Routes = function(app)
{
    if(initialized)
        throw "Cannot load more than 1 Routes moudule";
    
    initialized = true;
    this.initialize(app);
};

_.extend(Routes.prototype,
{
    _authSuccessRedirect: function(req, res)
    {
        res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
    },

    _ensureAuthenticated: function(req, res, next)
    {
        if (req.isAuthenticated())
            return next();

        res.statusCode = 401;
        res.end();
    },

	initialize: function(app)
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
		app.get("/auth/google/return", passport.authenticate("google", { failureRedirect: "/login" }), this._authSuccessRedirect);
        app.get("/auth/logout", function(req, res) { req.logout(); res.redirect("/"); });

        // REST API
        app.get("/api/plans", this._ensureAuthenticated, function(req, res)
        {
            app.controllres.plans.findAll(req.user.id).done(function(plans)
            {
                res.json(plans);
            })
        });

        app.post("/api/plans", this._ensureAuthenticated, function(req, res)
        {
            app.controllers.plans.addOne(req.body).done(function(result)
            {
                res.json(result);
            })
        });

        app.get("/api/users", this._ensureAuthenticated, function(req, res)
        {
            app.controllres.users.findOne(req.params.userId).done(function(user)
            {
                res.json(user);
            })
        });
	}
});

module.exports = Routes;
