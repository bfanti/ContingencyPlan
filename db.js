var MongoClient = require("mongodb").MongoClient;
var Q = require("q");

var _isInitialized = false;
var _db = null;

module.exports =
{
    initialize: function()
    {
        if(_isInitialized)
            throw "DB Module already initialized!";

        isInitialized = true;

        var deferred = Q.defer();

        MongoClient.connect("mongodb://dbuser:dbuser@ds039498-a0.mongolab.com:39498/heroku_app17368956", function(err, db)
        {
            if(err || !db)
            {
                deferred.reject(err);
                throw "Can't connect to Database";
            }

            _db = db;
            deferred.resolve(_db);
        });

        return deferred.promise;
    },

    db: _db
}


