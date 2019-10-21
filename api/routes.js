const async = require('async');
const JobSeeker = require('./helpers/JobSeeker');

module.exports = (app) => {

    /**
     * asynchronously renders the users resume
     * and queries the db for jobs
     * and compares them
     */
    app.post('/api/match', (req, res) => {
        let { location } = req.body || "";
        let { query } = req.body || "";
        let { resume } = req.files || "";

        let user = new JobSeeker(location, query);
        async.parallel([
            callback => user.renderPDF(resume.data, callback),

            // query jobs here...
        ], (err, results) => {
            if (err) res.send(err);

            console.log('');
            user.matchJobs(results[1]);
            user.sortJobsBy('matches');
            res.send(user);
        });
    });


};

