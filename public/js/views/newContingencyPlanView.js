define(
[
    "models/plans/contingencyPlanModel",
    "text!templates/views/plans/newContingencyPlan.template.html"
],
function(ContingencyPlanModel, newContingencyPlanTemplate)
{
    return Backbone.Marionette.ItemView.extend(
    {
        template: _.template(newContingencyPlanTemplate),
        tagName: "div",

        ui:
        {
            planName: "input[name='planName']",
            actionDate: "input[name='actionDate']",
            actionDescription: "textarea[name='actionDescription']",
            planIsActive: "input[name='activatePlan']"
        },

        events:
        {
            "click input[type='button']": "onNewClicked"
        },

        initialize: function(options)
        {
            this.plansCollection = options.collection;
            this.listenTo(this.plansCollection, "sync", this.onNewPlanCreated, this);
        },

        onRender: function()
        {
        },

        onNewClicked: function()
        {
            var plan =
            {
                name: this.ui.planName.val(),
                actionDate: new Date(this.ui.actionDate.val()),
                actionDescription: this.ui.actionDescription.val(),
                active: this.ui.planIsActive[0].checked
            };

            this.plansCollection.create(plan);
        },

        onNewPlanCreated: function()
        {
            alert("plan successfully created!");
        }
    }); 
});
