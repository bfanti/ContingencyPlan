
var Q = require("q");
var _ = require("underscore");
var Scheduler = require("./scheduler.js");

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

    findAll: function(id)
    {
        var deferred = Q.defer();

        this.plansCollection.find({ userId: id }).toArray(function(err, docs)
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

        this.plansCollection.delete({ id: planId }, function(err, result)
        {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve();
        });

        return deferred.promise;
    }
});

module.exports = Plans;
