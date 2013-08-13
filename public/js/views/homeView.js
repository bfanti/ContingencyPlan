define(
[
    "text!templates/views/homeView/homeView.template.html"
],
function(homeViewTemplate)
{
    return Backbone.Marionette.ItemView.extend(
    {
        template: _.template(homeViewTemplate),
        tagName: "div",
        className: "homeView jumbotron",

        events:
        {
            "click #loginButton": "onLoginButtonClicked"
        },

        onLoginButtonClicked: function()
        {
            window.open("http://127.0.0.1:5000/auth/google", "Google Auth", { height: 430, width: 480 });
        },

        onRender: function()
        {
        }
    }); 
});