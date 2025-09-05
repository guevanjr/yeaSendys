const express = require('express');
const axios = require('axios');
const port = process.env.PORT || 7225;
const app = express();

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


