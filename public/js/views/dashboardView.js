define(
[
    "text!templates/views/dashboardView.template.html"
],
function(dashboardViewTemplate)
{
   return Backbone.Marionette.ItemView.extend(
   {
        template: _.template(dashboardViewTemplate),

        initialize: function()
        {
            this.model = new (Backbone.Model.extend(
            {
                url: "http://127.0.0.1:5000/api/plans"
            }));

            this.model.fetch();
        },

        onRender: function()
        {

        }
   });
});
