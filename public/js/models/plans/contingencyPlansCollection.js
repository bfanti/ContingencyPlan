define(
[
    "models/plans/contingencyPlanModel"
],
function(ContingencyPlanModel)
{
    return Backbone.Collection.extend(
    {
        url: "/api/plans",
        model: ContingencyPlanModel
    });
});
