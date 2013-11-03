var Q = require("q");
var _ = require("underscore");

var Users = function(db)
{
    this.initialize(db);
};

_.extend(Users.prototype,
{
    initialize: function(db)    
    {
        this.usersCollection = db.collection("users");
    },

    findOne: function(id)
    {
        var deferred = Q.defer();

        this.usersCollection.find({ googleId: id }).toArray(function(err, docs)
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
