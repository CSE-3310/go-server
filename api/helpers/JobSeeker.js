
// PDFJS.disableTextLayer = true;
// PDFJS.disableWorker = true;

class JobSeeker {
  constructor(location, query) {
    this.location = location;
    this.query = query;

    this.resume = {
      filename: "",
      text: "",
      keywords: []
    };
  }


  matchJobs(jobs) {
    console.log(this.resume);
  }

}

module.exports = JobSeeker;
