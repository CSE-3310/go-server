
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
      let len = 0;
      for (let prop in this.resume.keywords) {

        if (hash[prop])
          count++;

        len++;
      }

      let sim = (count / len) * 100;
      jobs[i].sim = sim;
    }
    console.log(this.resume.hash);

    jobs = jobs.sort((a,b) => {
      return b.sim - a.sim;
    });

    return jobs;
  }


}

module.exports = User;
