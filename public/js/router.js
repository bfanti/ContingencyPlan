define(
[
    "views/dashboardView"
],
function(DashboardView)
{
    return Backbone.Router.extend(
    {
        initialize: function(options)
        {
            this.appIsLoaded = false;
        },

        routes:
        {
            "dashboard": "dashboard",
            "": "dashboard"
        },

        dashboard: function()
        {
            var dashboardView = new DashboardView();
            theApp.mainRegion.show(dashboardView);
        }
    });
});
