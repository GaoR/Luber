const express = require('express');
const cors = require('cors');
const path = require('path');
const lyft = require('node-lyft');
const keys = require('../apiKeys');

const app = express();
app.use(cors());

app.get('/checkLyft', (req, res) => {
  let defaultClient = lyft.ApiClient.instance;

  let clientAuth = defaultClient.authentications['Client Authentication'];
  clientAuth.accessToken = keys.lyft;

  let apiInstance = new lyft.PublicApi();

  let opts = { 
    'endLat': 37.7972,
    'endLng': -122.4533
  };

  apiInstance.getCost(37.7763, -122.3918, opts).then((data) => {
    res.send(data.cost_estimates);
  }, (error) => {
    console.error(error);
    res.send('error: ' + error);
  });
})

app.get('/checkUber', (req, res) => {

})

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve('public/bundle.js'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const port = 8008;

app.listen(port);