var _ = require("underscore");
var passport = require("passport");

var initialized = false;

var Routes = function(app)
{
    if(initialized)
    {
        throw "Cannot instantiate more than one Routes moudule";
    }
    
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
        {
            return next();
        }

        res.statusCode = 401;
        res.end();
    },

	initialize: function(app)
	{
        // Login, Logout, Account
        app.get("/", function(req, res)
        {
            if(req.isAuthenticated())
            {
                res.render("home", { name: req.user.firstName });
            }
            else
            {
                res.render("index");
            }
        });

        app.get("/app", function(req, res)
        {
            if(req.isAuthenticated())
            {
                res.render("app", { name: req.user.firstName, user: req.user });
            }
            else
            {
                res.redirect("/");
            }
        });

        // Google Auth endpoints
		app.get("/auth/google", passport.authenticate("google", { scope: [ "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email" ] }));
		app.get("/auth/google/return", passport.authenticate("google", { failureRedirect: "/login" }), this._authSuccessRedirect);
        app.get("/auth/logout", function(req, res) { req.logout(); res.redirect("/"); });
        app.get("/logout", function(req, res) { req.logout(); res.redirect("/"); });

        // REST API
        app.get("/api/plans", this._ensureAuthenticated, function(req, res)
        {
            app.controllers.plans.findAll(req.user._id).then(function(plans)
            {
                res.json(plans);
            }, function()
            {
                res.send(400, "Bad Request");
            });
        });

        app.get("/api/plans/:planId", this._ensureAuthenticated, function(req, res)
        {
            app.controllers.plans.findOne(req.user._id, req.params.planId).then(function(plan)
            {
                res.json(plan);
            }, function()
            {
                res.send(400, "No matching plan found");
            });
        });

        app.del("/api/plans/:planId", this._ensureAuthenticated, function(req, res)
        {
            app.controllers.plans.deleteOne(req.params.planId).then(function(data)
            {
                res.json({});
            }, function()
            {
                res.send(400, "No matching Plan found");
            });
        });

        app.post("/api/plans", this._ensureAuthenticated, function(req, res)
        {
            var plan = req.body;
            plan.userId = req.user._id;
            app.controllers.plans.addOne(req.body).then(function(result)
            {
                res.json(result);
            }, function()
            {
                res.send(400, "Could not create new plan");
            });
        });

        app.get("/api/users", this._ensureAuthenticated, function(req, res)
        {
            app.controllers.users.findOne(req.user._id).then(function(user)
            {
                res.json(user);
            });
        }, function(req, res)
        {
            res.send(400, "Bad Request");
        });
	}
});

module.exports = Routes;
