define(
[
    "views/navigationView",
    "router"
],
function(NavigationView, Router)
{
    var app = new Backbone.Marionette.Application();

    app.controllers = {};
    app.views = {};

    app.addRegions(
    {
        navigationRegion: "#navigation",
        mainRegion: "#main",
        infoRegion: "#info"
    });

    app.addInitializer(function()
    {
        this.authenticated = window.USER_AUTHENTICATED ? true : false;
    });

    app.addInitializer(function()
    {
        this.router = new Router();
        Backbone.history.start({ pushState: false, root: "127.0.0.1:5000" });
    });

    app.addInitializer(function()
    {
        // Initialize and show the NavigationView immediately
        app.views.navigationView = new NavigationView();
        app.navigationRegion.show(app.views.navigationView);
    })

    window.theApp = app;

    app.start();

    return app;
});
