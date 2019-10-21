const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors')


const port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(busboyBodyParser());
app.use(methodOverride('X-HTTP-Method-Overrride'));
app.use(cors());

require('./api/routes')(app);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`); 
});

exports = module.exports = app;