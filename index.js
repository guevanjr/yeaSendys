const express = require('express');
const axios = require('axios');
const port = process.env.PORT || 7225;
const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const sendysApi = require('./routes/sendys.routes.js');
app.use('/sendysApi', sendysApi);

app.get('/', function(req, res) {
    res.status(200).send('Sendys CRM Integration with Yeastar PBX!')
})

app.post('/', function(req, res) {

})

app.listen(port, function() {
    console.log('Sendys CRM Integration running on Port ' + port);
})


