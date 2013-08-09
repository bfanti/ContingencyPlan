var MongoClient = require("mongodb").MongoClient;
var plansCollection;
var Q = require("q");
var _ = require("underscore");

MongoClient.connect("mongodb://dbuser:dbuser@ds039498-a0.mongolab.com:39498/heroku_app17368956", function(err, db)
{
    if(err || !db)
        throw "Can't connect to Database";

    plansCollection = db.collection("contingencyPlans");
});

module.exports =
{
    findAll: function(id)
    {
        var deferred = Q.defer();

        plansCollection.find({ userId: id }).toArray(function(err, docs)
        {
            if(err !== null || docs === null)
                deferred.reject(err);
            else
                deferred.resolve(docs);
        });

        return deferred.promise;
    },

    addOne: function(plan)
    {
        var deferred = Q.defer();

        plansCollection.insert(plan, function(err, result)
        {
            if(err || result === null)
                deferred.reject(err);
            else
                deferred.resolve(result);
        });

        return deferred.promise;
    }
}
