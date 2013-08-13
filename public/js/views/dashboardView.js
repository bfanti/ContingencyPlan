define(
[
    "text!templates/views/dashboardView.template.html"
],
function(dashboardViewTemplate)
{
   return Backbone.Marionette.ItemView.extend(
   {
        template: _.template(dashboardViewTemplate)
   });
});
