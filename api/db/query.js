const Job = require('./Job.js');
const ObjectId = require('mongoose').Types.ObjectId;
/**
 * Queries the db for jobs, sending the 'query' param as an argument
 * then sets the db res to this.jobs
 * 
 * success - callback function for successful completion
 */
const queryJobs = (query, location, success) => {
    Job.find({}, (err, jobs) => {
        // extract the "_doc" property out of the array
        jobs = jobs.map(cur => cur._doc);

        success(jobs);
    });
}

const queryById = (id, callback) => {
    Job.find({"_id": ObjectId(id)}, (err, job) => {

        if (err) callback(err, null);

        callback(null, job[0]._doc);
    });
}

module.exports = {
    queryJobs: queryJobs,
    queryById: queryById
};