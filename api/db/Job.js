/**
 * Job schema for db
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = process.env.DB_URL || require('../config/db');

mongoose.connect(db);

const jobSchema = new Schema({
    api: String,
    company: String,
    title: String,
    description: String,
    location: String,
    how_to_apply: String,
    url: String,
    company_url: String,
    date: String,
    type: String,
    keywords: Array
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;