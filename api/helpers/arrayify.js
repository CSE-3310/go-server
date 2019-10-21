const keyword = require('keyword-extractor');

// this function simply takes a large string
// like a resume or job description, and
// uses a library to extract the keywords,
// and return a sorted array of the keywords
const arrayify = bigString => {
    // get the keywords, remove elements that only have special characters
    let keywords = keyword.extract(bigString, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    }).filter(cur => cur.length > 1);

    // filter out stopwords 
    return keywords.sort();

}

module.exports = arrayify;