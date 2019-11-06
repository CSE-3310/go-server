const async = require("async");
const arrayify = require("./arrayify");
const external = require("./external");
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
    // let buffer = await external.getFile(filename);
    // get the text
    // pdfjs getTextContent() returns an
    // array of objects which contains a
    // property 'str'
    // this will concatenate all the objects

    // return PDFJS.getDocument(filename).promise
    //   .then(pdf => {
    //     pdf.getPage(1).then(page => {
    //       page.getTextContent().then(txt => {
    //         let { items } = txt;
    //         let concat = items.map(cur => cur.str).join("");
    //         // this.resume.text = concat;
    //         // this.resume.keywords = arrayify(concat);

    //         console.log(concat)
    //         return concat;
    //       });
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    return getPDFText(filename);

  }
}

const getPageText = async (pdf, pageNo) => {
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  const pageText = tokenizedText.items.map(token => token.str).join("");
  return pageText;
};

const getPDFText = async source => {
  let pageText = "";
  try {
    const pdf = await PDFJS.getDocument(source).promise;
    const page = await pdf.getPage(1);
    const tokenizedText = await page.getTextContent();
    pageText = tokenizedText.items.map(token => token.str).join("");
  } catch (err) {
    console.log(err);
  }

  return pageText;
};

module.exports = JobSeeker;
