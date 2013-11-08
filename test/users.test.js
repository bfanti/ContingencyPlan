var sinon = require("sinon");
var chai = require("chai");
var expect = require('chai').expect;
var should = require('chai').should();
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var Users = require("../users");
var mongo = require("mongodb");
var BSON = mongo.BSONPure;

describe("testSuite", function()
{
    var userCollection =
    {
        findOne: function(query, callback)
        {
            if(query._id === new BSON.ObjectID("123456789012"))
                callback(null, { _id: 1234, firstName: "test", lastName: "user" });
            else
                callback("error", null);
        }
    };

    var db = 
    {
        collection: function(collectionName)
        {
            return userCollection;
        }
    }

    it("should have a constructor", function()
    {
        should.not.throw(function() { new Users(db) }); 
    });

    it("should find one user by userId", function()
    {
        var users = new Users(db);
        users.findOne("123456789012").should.eventually.be.fulfilled;
        users.findOne("098765432123").should.eventually.be.rejected;
    });

});
