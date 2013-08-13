define(
[
    "views/homeView",
    "views/dashboardView"
],
function(HomeView, DashboardView)
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
            "home": "home",
            "": "home"
        },

        dashboard: function()
        {
            var dashboardView = new DashboardView();
            theApp.mainRegion.show(dashboardView);
        },

        home: function()
        {
            var homeView = new HomeView();
            theApp.mainRegion.show(homeView);
        }
    });
});
