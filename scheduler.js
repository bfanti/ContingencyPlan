var MongoClient = require("mongodb").MongoClient;
var Q = require("q");
var _ = require("underscore");
var nodeSchedule = require("node-schedule");

var Scheduler = function(db)
{
    this._initialize(db);
};

_.extend(Scheduler.prototype,
{
    _initialize: function(db)
    {
        this.jobsCollection = db.collection("contingencyJobs");
    },

    _onJobComplete: function(jobId)
    {
        console.log("Job completed: " + dbPlanJob.name);
        self.jobsCollection.remove({ _id: jobId }, function(err, data) { });;
    },

    loadJobsFromDB: function()
    {
        var self = this;

        // Load any exisitng cron tasks from datbaase
        this.jobsCollection.find().toArray(function(err, dbPlanJobs)
        {
            _.each(dbPlanJobs, function(dbPlanJob)
            {
                // Eliminate those that are already in the past
                if(!dbPlanJob.scheduledDate || new Date(dbPlanJob.scheduledDate) <= new Date())
                {
                    self.jobsCollection.remove({ _id: dbPlanJob._id }, function(err, data) { });;
                    return;
                }

                // Create new cron tasks for all of them
                nodeSchedule.scheduleJob(new Date(dbPlanJob.scheduledDate), function()
                {
                    self._onJobComplete(dbPlanJob._id);
                });
            });
        });
    },

    schedule: function(plan)
    {
        if(!plan.scheduledDate)
            throw "Cannot schedule plan job without scheduled date";

        var self = this;
        var deferred = Q.defer();

        var dbCronJob =
        {
            scheduledDate: plan.scheduledDate,
            name: plan.name
        };

        this.jobsCollection.insert(dbCronJob, function(err, dbPlanJob)
        {
            if(err || dbPlanJob === null)
            {
                deferred.reject(err);
                return;
            }

            // Successfully saved to the database, let's fire it up.
            var job = nodeSchedule.scheduleJob(new Date(dbCronJob.scheduledDate), function()
            {
                self._onJobComplete(dbPlanJob._id);
            });

            if(job)
                deferred.resolve();
            else
                deferred.reject("Unable to schedule job using node-schedule");
        });

        return deferred.promise;
    }
});

module.exports = Scheduler;
    
