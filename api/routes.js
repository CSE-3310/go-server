const async = require("async");
const JobSeeker = require("./helpers/JobSeeker");
const external = require("./helpers/external");
module.exports = app => {
  /**
   * asynchronously renders the users resume
   * and queries the db for jobs
   * and compares them
   */
  app.post("/api/match", async (req, res) => {
    let { location } = req.body || "";
    let { query } = req.body || "";
    let filename = "https://raw.githubusercontent.com/vardaro/vardaro.github.io/master/assets/resume.pdf";

    console.log(`Location: ${location}`);
    console.log(`Query: ${query}`);
    console.log(`File: ${filename}`);

    let user = new JobSeeker(location, query, filename);

    // Extract the resume, get jobs from external APIs
    let [resume, jobs] = await Promise.all([
      user.renderPDF(filename),
      external.getJobs(user.location, user.query)
    ]);

    console.log(resume);

    res.send(resume);
  });
};
