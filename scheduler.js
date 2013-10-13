var MongoClient = require("mongodb").MongoClient;
var Q = require("q");
var _ = require("underscore");
var scheduler = require("node-schedule");

var isInitialized = false;

var jobsCollection;

MongoClient.connect("mongodb://dbuser:dbuser@ds039498-a0.mongolab.com:39498/heroku_app17368956", function(err, db)
{
    if(err || !db)
        throw "Can't connect to Database";

    jobsCollection = db.collection("contingencyJobs");
});

module.exports =
{
    initialize: function()
    {
        return;
        
        if(isInitialized)
            return;

        // Load any exisitng cron tasks from datbaase
        jobsCollection.find().forEach(function(err, dbPlanJob)
        {
            // Eliminate those that are already in the past
            if(!dbPlanJob.scheduledDate || dbPlanJob.scheduledDate <= new Date())
            {
                dbPlanJob.remove();
            }

            // Create new cron tasks for all of them
            scheduler.scheduleJob(new Date(dbPlanJob.scheduledDate), function()
            {
                console.log("YAY");
                jobsCollection.remove({ _id: dbPlanJob._id });
            });
        });

        // Done initializing
        isInitialized = true;
    },

    schedule: function(plan)
    {
        if(!plan.scheduledDate)
            throw "Cannot schedule plan job without scheduled date";

        var deferred = Q.defer();

        var dbCronJob =
        {
            scheduledDate: plan.scheduledDate,
            name: plan.name
        };

        jobsCollection.insert(dbCronJob, function(err, dbPlanJob)
        {
            if(err || dbPlanJob === null)
            {
                deferred.reject(err);
            }
            else
            {
                // Successfully saved to the database, let's fire it up.
                scheduler.scheduleJob(new Date(dbCronJob.scheduledDate), function()
                {
                    console.log("YAY2");
                    jobsCollection.remove({ _id: dbPlanJob._id });
                });

                deferred.resolve();
            }
        });

        return deferred.promise;
    }
}
