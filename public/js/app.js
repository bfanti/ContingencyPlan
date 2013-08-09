define(
[
],
function()
{
    var app = new Backbone.Marionette.Application();

    app.addRegions(
    {
        mainRegion: "#main"
    });

    app.addInitializer(function()
    {
    });

    return app;
});