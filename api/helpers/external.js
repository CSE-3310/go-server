const request = require("request");
const arrayify = require("./arrayify");
const async = require("async");

class Job {
  constructor(jobsite, initial) {
    this.site = jobsite;
    this.initial = initial;
    this.tree = this.buildObj();
  }
  /**
   * Different apis provide the same info but with slightly
   * different property name
   * buildObj() makes all the name consistent
   */
  buildObj() {
    switch (this.site) {
      case "GithubJobs": {
        return this.formGithubJobs();
      }
    }
  }

  formGithubJobs() {
    return {
      api: "GithubJobs",
      company: this.initial.company,
      title: this.initial.title,
      description: this.initial.description,
      location: this.initial.location,
      how_to_apply: this.initial.how_to_apply,
      url: this.initial.url,
      compasny_url: this.initial.company_url,
      date: this.initial.created_at,
      type: this.initial.type,
      keywords: arrayify(this.initial.description)
    };
  }
}

class JobSite {
  constructor(jobsite) {
    this.jobsite = jobsite;
    this.tunedlist = [];
    //this.setArray(resp);
    //this.tuneListings();
  }

  setTunedList(resp, tune, cb) {
    switch (this.jobsite) {
      case "GithubJobs": {
        this.joblist = resp;
        break;
      }
    }

    if (tune) {
      this.tuneListings();
    }

    cb();
  }
  /**
   * This function will ensure all the property names
   * of the response are consistent
   */
  tuneListings() {
    this.joblist.map(cur => {
      let curJob = new Job(this.jobsite, cur);
      this.tunedlist.push(curJob.tree);
    });
  }
}

/*const getJobs = (location, query, callback) => {
    console.time('request');
    let jobData = {
        GithubJobs: {
            name: "GithubJobs",
            link: `https://jobs.github.com/positions.json?description=${query}&location=${location}`
        }
    }

    // this array contains all the jobs
    // from all the apis
    let parentJobArray = [];

    // iterate over jobsites and make a request to each api
    async.each(jobData, (cur, cb) => {
        request({ url: cur.link }, (err, resp, body) => {
            // if error happens, just skip the api
            if (!err) {
                body = JSON.parse(body);

                let site = new JobSite(cur.name);
                site.setTunedList(body, true, () => {
                    // merge the joblist into the parent job array
                    parentJobArray.push.apply(parentJobArray, site.tunedlist);
                    cb();
                });
            }
        });
    }, (err) => {
        if (err) failure(err);
        console.timeEnd('request');
        success(parentJobArray);
    });
}*/

const httpPromise = link => {
  return new Promise((resolve, reject) => {
    request(link, (err, response, body) => {
      // in addition to parsing the value, deal with possible errors
      if (err) return reject(err);
      try {
        resolve(body);
      } catch (e) {
        reject(e);
      }
    });
  });
};

/**
 * Returns array of request results of SITES array.
 * @param {string} location location of jobs
 * @param {string} query    query string keyword
 */
const getJobs = async (location, query) => {
  const SITES = [
    {
      name: "GithubJobs",
      link: `https://jobs.github.com/positions.json?description=${query}&location=${location}`
    }
  ];

  let promiseArray = SITES.map(cur => httpPromise(cur.link));

  return Promise.all(promiseArray);
};

/**
 * Returns a promise resolving the buffer of a PDF, rejecting an error.
 * @param {string}   link     link to resume
 * @param {function} callback resolve function
 */
const getFile = async link => {
  return httpPromise(link);
};

module.exports = {
  getJobs: getJobs,
  getFile: getFile
};
