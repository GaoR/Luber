const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const lyft = require('node-lyft');
const Uber = require('node-uber');
const bodyParser = require('body-parser');
const { getLocations, postLocation } = require('../database/index.js');
const keys = require('../apiKeys');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.use(express.static(__dirname + '/../public'));

const uber = new Uber({
  client_id: keys.uber.client_id,
  client_secret: keys.uber.client_secret,
  server_token: keys.uber.server_token,
  redirect_uri: 'http://127.0.0.1:8008/api/callback',
  name: 'Loober',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true,
});

app.get('/recentPlaces', (req, res) => {
  getLocations((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.get('/api/login', (req, res) => {
  const url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
  console.log(url);
  res.send(url);
});

// app.get('/api/map', (req, res) => {
//   axios.get()
// })

app.get('/api/geocode', (req, res) => {
  const params = {
    address: req.query.start,
    key: keys.google,
  };
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params })
    .then((data) => {
      const location = data.data.results[0].geometry.location;
      const params = {
        address: req.query.end,
        key: keys.google,
      };
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params })
        .then((data) => {
          const locations = {
            start: location,
            end: data.data.results[0].geometry.location,
          };
          // console.log(locations);
          res.send(locations);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

app.get('/checkLyft', (req, res) => {
  const defaultClient = lyft.ApiClient.instance;

  const clientAuth = defaultClient.authentications['Client Authentication'];
  clientAuth.accessToken = keys.lyft;

  const apiInstance = new lyft.PublicApi();
  const start = JSON.parse(req.query.start);
  const end = JSON.parse(req.query.end);
  // console.log(start, end);

  const opts = {

    endLat: end.lat,
    endLng: end.lng,
  };

  apiInstance.getCost(start.lat, start.lng, opts).then((data) => {
    res.send(data.cost_estimates);
  }, (error) => {
    console.error(error);
    res.send(`error: ${error}`);
  });
});

app.get('/api/callback', (req, res) => {
  uber.authorizationAsync({ authorization_code: req.query.code })
    .spread((accessToken, refreshToken, authorizedScopes, tokenExpiration) => {
      // store the user id and associated access_token, refresh_token, scopes, token expiration date
      console.log(`New access_token retrieved: ${accessToken}`);
      console.log(`... token allows access to scopes: ${authorizedScopes}`);
      console.log(`... token is valid until: ${tokenExpiration}`);
      console.log(`... after token expiration, re-authorize using refresh_token: ${refreshToken}`);

      // redirect the user back to your actual app
      res.redirect('/');
    })
    .error((err) => {
      console.error(err);
    });
});

app.get('/checkUber', (req, res) => {
  const start = JSON.parse(req.query.start);
  const end = JSON.parse(req.query.end);
  // uber.estimates.getPriceForRouteAsync(start_lat, start_long, end_lat, end_long [,seats]);
  uber.estimates.getPriceForRouteAsync(start.lat, start.lng, end.lat, end.lng)
    .then((data) => {
      res.send(data.prices);
    })
    .error((err) => { console.error(err); });
});

app.post('/postLocation', (req, res) => {
  console.log(req.body);
  postLocation(req.body, (err) => {
    if (err) {
      console.log(err);
    } else res.send('Saved!');
  });
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve('public/bundle.js'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.resolve('public/styles.css'));
});

app.get('/lyftlogo', (req, res) => {
  res.sendFile(path.resolve('public/lyftlogo.png'));
});

app.get('/uberlogo', (req, res) => {
  res.sendFile(path.resolve('public/uberlogo.jpg'));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const port = 8008;

app.listen(port, () => console.log(`Listening on port ${port}!`));
