var Q = require("q");
var _ = require("underscore");
var mongo = require("mongodb");
var BSON = mongo.BSONPure;

var Users = function(db)
{
    this._initialize(db);
};

_.extend(Users.prototype,
{
    _initialize: function(db)    
    {
        this.usersCollection = db.collection("users");
    },

    findOne: function(userId)
    {
        var deferred = Q.defer();

        this.usersCollection.findOne({ _id: new BSON.ObjectID(userId) }, function(err, user)
        {
            if(err !== null || !user)
                deferred.reject(err);
            else
                deferred.resolve(user);
        });

        return deferred.promise;
    },

    findByGoogleProfileOrCreate: function(profile)
    {
        var self = this;
        var deferred = Q.defer();

        this.usersCollection.find({ googleId: profile.id }).toArray(function(err, docs)
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

                self._create(newUser).done(function(result)
                {
                    deferred.resolve(result);
                })
            }
            else if(docs.length > 1)
            {
                deferred.reject();
            }
            else
            {
                deferred.resolve(docs[0]);
            }
        });

        return deferred.promise;
    },

    _create: function(user)
    {
        var deferred = Q.defer();

        this.usersCollection.insert(user, function(err, result)
        {
            if(err !== null)
                deferred.reject(err);
            else
                deferred.resolve(result);
        });

        return deferred.promise;
    }
});

module.exports = Users;
