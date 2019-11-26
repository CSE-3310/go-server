const request = require("request");

const memcache = require("memory-cache");

const httpPromise = link => {
  let cache_results = memcache.get(link);

  if (cache_results) {
    return new Promise((resolve, reject) => {
      console.log(`Cache found for ${link}`);
      resolve(cache_results);
    });
  }

  return new Promise((resolve, reject) => {
    request(link, (err, response, body) => {
      if (err) return reject(err);
      try {
        let json = JSON.parse(body);
        memcache.put(link, json);
        resolve(json);
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

  // TODO: MORE SITE SUPPORTED
  let promiseArray = SITES.map(cur => httpPromise(cur.link));

  let array = await Promise.all(promiseArray);
  return array[0];
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
