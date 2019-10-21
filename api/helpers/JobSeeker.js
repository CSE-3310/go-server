const async = require('async');
const arrayify = require('./arrayify');
const PDFJS = require('pdfjs-dist');
const Job = require('../db/Job');

class JobSeeker {

    constructor(location, query) {
        this.location = location;
        this.query = query;

        this.resume = {
            text: '',
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
        }

        // iterate over array of job objects
        async.each(jobArray, (cur, cb) => {
            cur.commons = search(cur.keywords);
            cur.matches = cur.commons.length;
            cb();
        }, (err) => {
            if (err) console.log("wtf");
            this.jobs = jobArray;
        });

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

    /**
     * takes raw pdf string and uses PDFJS to parse the text
     * 
     * buffer - raw pdf string from user
     * success - on success callback function
     * yikes - error callback function
     */
    renderPDF(buffer, success, yikes) {
        // get the text
        // pdfjs getTextContent() returns an
        // array of objects which contains a
        // property 'str'
        // this will concatenate all the objects
        PDFJS.getDocument(buffer).then(pdf => {
            pdf.getPage(1).then(page => {
                page.getTextContent().then(txt => {
                    let { items } = txt;
                    let concat = items.map(cur => cur.str).join('');
                    this.resume.text = concat;
                    this.resume.keywords = arrayify(concat);
                    success();
                });
            });
        }).catch(err => {
            yikes(err);
        });
    }
}

module.exports = JobSeeker;