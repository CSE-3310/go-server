const inject = (id, val) => {
    $(`#${id}`).html(val);
}

const queryJob = (id, callback) => {
    $.ajax({
        type: 'GET',
        url: `http://localhost:9000/api/job/${id}`,
    })
        .done(data => {
            callback(data);
        });
}
$(document).ready(() => {
    inject('numResume', JSON.parse(Cookies.get('resume_keywords')).length + " keywords");
    // get the url and seperate by &
    let url = window.location.search.substring(1);
    let params = url.split('&');

    console.log(params);

    // Extract the Id from url, then query db for specific job by id
    let id = params[0].split('=')[1];
    queryJob(id, data => {
        job = data;
        console.log(job);

        for (let prop in job) {
                inject(prop, job[prop] || 'N/A');
        }
        inject('url', `<a target="_blank" href="${job.url}">Apply</a>`)
        inject('numKeywords', job.keywords.length + " keywords in desc.")
    });

    // parse integer of number of matches form url
    let matches = params[1].split('=')[1];
    inject('matches', matches + " matching keywords");

    // parse array of strings from url, each word in array is split by '%2C'
    let commons = params[2].split('=')[1].split('%2C');
    inject('commons', commons.join(', '));

});