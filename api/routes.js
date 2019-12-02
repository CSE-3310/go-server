const User = require("./helpers/User");
const external = require("./helpers/external");
const renderPDF = require("./helpers/pdf");
module.exports = app => {
  /**
   * asynchronously renders the users resume
   * and queries the db for jobs
   * and compares them
   */
  app.post("/api/match", async (req, res) => {
    let { location } = req.body || "";
    let { query } = req.body || "";
    let {filename} = req.body || "";

    console.log(`Location: ${location}`);
    console.log(`Query: ${query}`);
    console.log(`File: ${filename}`);

    let user = new User(location, query);

    if (!filename) {
      let jobs = await external.getJobs(user.location, user.query);
      res.send(jobs);
      return;
    }

    // Extract the resume, get jobs from external APIs
    let [resume, jobs] = await Promise.all([
      renderPDF(filename),
      external.getJobs(user.location, user.query)
    ]);

    user.resume = resume;
    
    jobs = user.matchJobs(jobs);

    res.send(jobs);
  });
};
