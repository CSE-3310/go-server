const {
    Worker, isMainThread, parentPort, workerData
  } = require('worker_threads');
  
  if (isMainThread) {
    module.exports = function match_jobs(user, jobs) {
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: {
              user: user,
              jobs: jobs
          }
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0)
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    };
  } else {
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

    parentPort.postMessage(jobs );
  }