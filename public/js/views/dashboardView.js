define(
[
    "views/newContingencyPlanView",
    "views/myContingencyPlansView",
    "models/plans/contingencyPlansCollection",
    "text!templates/views/dashboardView.template.html"
],
function(NewContingencyPlanView, MyContingencyPlansView, ContingencyPlansCollection, dashboardViewTemplate)
{
   return Backbone.Marionette.Layout.extend(
   {
        template: _.template(dashboardViewTemplate),

        regions:
        {
            newPlan: "div.createNewPlanContainer",
            existingPlans: "div.existingPlansContainer"
        },

        initialize: function()
        {
            this.contingencyPlans = new ContingencyPlansCollection();
            this.deferred = this.contingencyPlans.fetch();
        },

        onRender: function()
        {
            var self = this;
            this.newPlan.show(new NewContingencyPlanView({ collection: this.contingencyPlans }));
            this.deferred.done(function()
            {
                self.existingPlans.show(new MyContingencyPlansView({ collection: self.contingencyPlans }));
            });
        }
   });
});
