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
            if(theApp.authenticated)
                this.$("li[data-target='dashboard']").removeClass("disabled");
        },

        onNavigationClicked: function(e)
        {
            var $navItem = $(e.target);
            var target = $navItem.closest("li[data-target]").data("target");

            switch(target)
            {
                case "home": this.navigateTo("home"); return;
                case "login": this.navigateTo("login"); return;
                case "dashboard": this.navigateTo("dashboard"); return;
                case "about": this.navigateTo("about"); return;
                default: return;
            }
        },

        navigateTo: function(target)
        {
            theApp.router.navigate(target, { trigger: true });
        }
    });
}); 
