define(
[
    "text!templates/views/navigationView.template.html"
],
function(navigationViewTemplate)
{
    return Backbone.Marionette.ItemView.extend(
    {
        template: _.template(navigationViewTemplate),
        tagName: "div",
        className: "navigationView masthead",

        events:
        {
            "click li:not(.disabled)": "onNavigationClicked"
        },

        onRender: function()
        {
        },

        onNavigationClicked: function(e)
        {
            var $navItem = $(e.target);
            var target = $navItem.closest("li[data-target]").data("target");

            switch(target)
            {
                case "dashboard": this.navigateTo("dashboard"); return;
                case "logout": this.navigateTo("/auth/logout"); return;
                default: return;
            }
        },

        navigateTo: function(target)
        {
            theApp.router.navigate(target, { trigger: true });
        }
    });
}); 
