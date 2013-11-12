requirejs.config(
{
    baseUrl: "js",

    paths:
    {
        "text": "vendor/text",
        "views": "views",
        "models": "models",
        "templates": "../templates"
    },

    shim:
    {
    }
});

require([ "app" ], function(app) {});
