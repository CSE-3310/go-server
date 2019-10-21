/**
 * This is designed to run every 24 hours
 * for refreshing the db with new jobs
 */
const getJobs = require("../helpers/get.js");
const Job = require('./Job');

// query jobs apis
getJobs('', '', data => {
    // remove everything in db
    Job.remove({}, err => {
        if (err) throw err;
        // iterate over jobs from apis, save each iteration  to  db
        for (let i = 0; i < data.length; i++) {
            let scheme = new Job(data[i]);

            scheme.save(err => {
                if (err) throw err;
            });
        }
        console.log("Jobs refilled");
    });
});