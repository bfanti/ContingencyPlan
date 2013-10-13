define(
[
    "text!templates/views/plans/myContingencyPlans.template.html"
],
function(myContingencyPlansTemplate)
{
    return Backbone.Marionette.ItemView.extend(
    {
        template: _.template(myContingencyPlansTemplate),
        tagName: "div",

        events:
        {
        },

        onRender: function()
        {
        }
    }); 
});
