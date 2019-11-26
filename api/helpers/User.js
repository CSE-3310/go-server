
// PDFJS.disableTextLayer = true;
// PDFJS.disableWorker = true;

const compose = require("./compose");

class User {
  constructor(location, query) {
    this.location = location;
    this.query = query;

    this.resume = {};
  }


  matchJobs(jobs) {
    console.log("Num jobs " + jobs.length);

    for(let i = 0; i < jobs.length; i++) {
      let desc = jobs[i].description;

      let hash = compose(desc);

      // find the percent of keys in object 1 that match object 2
      let count = 0;
      let length_iter = 0;
      for (let prop in this.resume.keywords) {

        if (hash[prop])
          count++;

        length_iter++;
      }

      let sim = (count / length_iter) * 100;
      jobs[i].sim = sim;
    }

    // Sort the jobs by rank, descending
    jobs = jobs.sort((a,b) => {
      return b.sim - a.sim;
    });

    return jobs;
  }


}

module.exports = User;
