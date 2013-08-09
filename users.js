var MongoClient = require("mongodb").MongoClient;
var usersCollection;
var Q = require("q");
var _ = require("underscore");

module.exports =
{
    init: function()
    {
        MongoClient.connect("mongodb://dbuser:dbuser@ds039498-a0.mongolab.com:39498/heroku_app17368956", function(err, db)
        {
            if(err || !db)
                throw "Can't connect to Database";

            usersCollection = db.collection("users");
        });
    },

    findOne: function(id)
    {
        var deferred = Q.defer();

        usersCollection.find({ googleId: id }).toArray(function(err, docs)
        {
            if(err !== null || docs.length !== 1)
                deferred.reject(err);
            else
                deferred.resolve(docs[0]);
        });

        return deferred.promise;
    },

    findOrCreate: function(profile)
    {
        var deferred = Q.defer();

        usersCollection.find({ googleId: profile.id }).toArray(function(err, docs)
        {
            if(err !== null || docs.length !== 1)
            {
                var newUser = _.extend(profile, {});
                newUser.googleId = profile.id;
                delete newUser.id;

                usersCollection.insert(profile, function(err, result)
                {
                    if(err !== null)
                        deferred.reject(err);
                    else
                        deferred.resolve(result);
                });
            }
            else
                deferred.resolve(docs[0]);
        });

        return deferred.promise;
    }
}

