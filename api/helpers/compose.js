const crypto = require("crypto");
const stopword = require("stopword");
const stemmer = require("stemmer");

const md5 = crypto.createHash("md5");

const compose = raw => {
  // Split by space
  let keys = raw.split(/\s+/);

  // Filter out the stopwords from the PDF text
  keys = stopword.removeStopwords(keys);

  // Remove the small words that escaped the stopword filter
  keys = keys.filter(cur => cur.length > 2);

  // Stem what's left

  let hash = {};

  keys.map(cur => {
    cur = cur.replace(/[^\w\s]|_/g, "");
    cur = stemmer(cur);
    hash[cur] = 1;
  });

  return hash;
};

module.exports = compose;
