
var Q = require("q");
var _ = require("underscore");
var Scheduler = require("./scheduler.js");
var mongo = require("mongodb");
var BSON = mongo.BSONPure;

var Plans = function(db)
{
    this.initialize(db);
};

_.extend(Plans.prototype,
{
    initialize: function(db)
    {
        this.scheduler = new Scheduler(db);
        this.plansCollection = db.collection("contingencyPlans");
    },

    findAll: function(userId)
    {
        var deferred = Q.defer();

        this.plansCollection.find({ userId: userId }).toArray(function(err, docs)
        {   
            if(err !== null || docs === null)
                deferred.reject(err);
            else
                deferred.resolve(docs);
        });

        return deferred.promise;
    },

    findOne: function(userId, planId)
    {
        var deferred = Q.defer();

        this.plansCollection.findOne({ userId: userId, _id: planId }, function(err, doc)
        {   
            if(err !== null || !doc)
                deferred.reject(err);
            else
                deferred.resolve(doc);
        });

        return deferred.promise;
    },

    addOne: function(plan)
    {
        var self = this;
        var deferred = Q.defer();

        this.plansCollection.insert(plan, function(err, result)
        {
            if(err || result === null)
                deferred.reject(err);
            else
                deferred.resolve(result);
        });

        // If the plan is marked as active on creation, we need to schedule the plan handler for execution
        if(plan.active)
        {
            deferred.promise.done(function()
            {
                self.scheduler.schedule(plan);
            });   
        }

        return deferred.promise;
    },

    deleteOne: function(planId)
    {
        var deferred = Q.defer();

        this.plansCollection.remove({ _id: new BSON.ObjectID(planId) }, function(err, numberOfRemovedDocs)
        {
            if(numberOfRemovedDocs < 1)
                deferred.reject();
            else
                deferred.resolve();
        });

        return deferred.promise;
    }
});

module.exports = Plans;
