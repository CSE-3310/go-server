const async = require("async");
const stopword = require("stopword");
const stemmer = require("stemmer");
const PDFJS = require("pdfjs-dist");

// PDFJS.disableTextLayer = true;
// PDFJS.disableWorker = true;

class JobSeeker {
  constructor(location, query, resume) {
    this.location = location;
    this.query = query;

    this.resume = {
      filename: resume,
      text: "",
      keywords: []
    };

    this.jobs = [];
  }

  /**
   * Compares job keywords with user keywords
   * appends a 'commons' and 'matches' property to the Job object
   */
  matchJobs(jobArray) {
    // iterate over job keywords, check for keyword in current job
    const search = curJobKeywords => {
      let commons = [];
      this.resume.keywords.map(cur => {
        if (curJobKeywords.indexOf(cur) !== -1) {
          commons.push(cur);
        }
      });
      return commons;
    };

    // iterate over array of job objects
    async.each(
      jobArray,
      (cur, cb) => {
        cur.commons = search(cur.keywords);
        cur.matches = cur.commons.length;
        cb();
      },
      err => {
        if (err) console.log("wtf");
        this.jobs = jobArray;
      }
    );
  }
  /**
   * Sorts the jobs arrray by keyword matches
   *
   * prop - string containing property name of the Job object
   *
   * ex - sortJobsBy('matches'); will sort the jobs by values in the matches property
   */
  sortJobsBy(prop) {
    // sort by keyword matches and return
    this.jobs.sort((a, b) => {
      return b[prop] - a[prop];
    });
  }

  async renderPDF(filename) {
    let words = await getPDFText(filename);
    
    // Filter out the stopwords from the PDF text
    words = stopword.removeStopwords(words.split(/\s+/));

    // Remove the small words that escaped the stopword filter
    words = words.filter((cur => cur.length > 2));

    // Stem what's left
    words = words.map(cur => stemmer(cur));

    return words;
  }
}

const getPDFText = async source => {
  let pageText = "";

  const pdf = await PDFJS.getDocument(source).promise;
  const page = await pdf.getPage(1);
  const tokenizedText = await page.getTextContent();
  pageText = tokenizedText.items.map(token => token.str).join("");

  return pageText;
};

module.exports = JobSeeker;
