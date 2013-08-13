var MongoClient = require("mongodb").MongoClient;
var usersCollection;
var Q = require("q");
var _ = require("underscore");


var connectDb = function()
{
    MongoClient.connect("mongodb://dbuser:dbuser@ds039498-a0.mongolab.com:39498/heroku_app17368956", connectCallback);
};

var connectCallback = function(err, db)
{
    if(err || !db)
    {
        connectDb();
        return;
    }

    usersCollection = db.collection("users");
};

connectDb();
        
module.exports =
{
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
        var self = this;
        var deferred = Q.defer();

        usersCollection.find({ googleId: profile.id }).toArray(function(err, docs)
        {
            if(err !== null || docs.length !== 1)
            {
                var newUser =
                {
                    googleId: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    displayName: profile.displayName,
                    emails: profile.emails
                };

                self.create(newUser).done(function(result)
                {
                    deferred.resolve(result);
                })
            }
            else
                deferred.resolve(docs[0]);
        });

        return deferred.promise;
    },

    create: function(user)
    {
        var deferred = Q.defer();

        usersCollection.insert(user, function(err, result)
        {
            if(err !== null)
                deferred.reject(err);
            else
                deferred.resolve(result);
        });

        return deferred.promise;
    }
}

