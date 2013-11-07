define(
[
    "views/contingencyPlanView",
    "text!templates/views/plans/myContingencyPlans.template.html"
],
function(ContingencyPlanView, myContingencyPlansTemplate)
{
    return Backbone.Marionette.CompositeView.extend(
    {
        template: _.template(myContingencyPlansTemplate),
        tagName: "div",

        itemView: ContingencyPlanView,
        itemViewContainer: ".collectionContainer",

        events:
        {
        },

        initialize: function(options)
        {
        },

        onRender: function()
        {
        }
    }); 
});
