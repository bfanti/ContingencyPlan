define(
[
    "text!templates/views/plans/contingencyPlan.template.html"
],
function(contingencyPlanTemplate)
{
    return Backbone.Marionette.ItemView.extend(
    {
        template: _.template(contingencyPlanTemplate),
        tagName: "div",
        className: "contingencyPlanView",
        events:
        {
            "click p": "onPlanClicked"
        },
        onPlanClicked: function(event)
        {
            console.log("destroy!");
            this.model.destroy({ wait: true });
        }
    });
});
