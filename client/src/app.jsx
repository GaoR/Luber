import React, { Component } from 'react';
import axios from 'axios';

const convertSeconds = time => `${Math.floor(time / 60)} min`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyft: [],
      uber: [],
      uberURL: '',
      startAdd: '',
      endAdd: '',
      startCoords: '',
      endCoords: '',
      login: false,
      map: {},
    };

    this.comparePrices = this.comparePrices.bind(this);
    this.checkLyft = this.checkLyft.bind(this);
    this.checkUber = this.checkUber.bind(this);
    this.login = this.login.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleStart(e) {
    this.state.start = e.target.value;
  }

  handleEnd(e) {
    this.state.end = e.target.value;
  }

  comparePrices() {
    const { start, end } = this.state;
    axios.get('/api/geocode', {
      params: { start, end },
    })
      .then((data) => {
        const locations = {
          start: data.data.start,
          end: data.data.end,
        };

        this.state.startCoords = locations.start;
        this.state.endCoords = locations.end;
        
        this.checkLyft(locations.start, locations.end);
        this.checkUber(locations.start, locations.end);
      })
      .catch(err => console.log(err));
  }

  getMap(start, end) {
    axios.get('/api/map', {
      params: { start, end },
    })
      .then(data => this.setState({
        map: data,
      }))
      .catch(err => console.log(err));
  }

  checkLyft(start, end) {
    axios.get('/checkLyft', {
      params: { start, end },
    })
      .then(data => this.setState({
        lyft: data.data,
      }))
      .catch(err => console.log(err));
  }

  checkUber(start, end) {
    axios.get('/checkUber', {
      params: { start, end },
    })
      .then(data => this.setState({
        uber: data.data,
      }))
      .then(() => {
        const {
          lyft,
          uber,
          startAdd,
          endAdd,
          startCoords,
          endCoords,
        } = this.state;
        const data = {
          start: {
            address: startAdd,
            lat: startCoords.lat,
            lng: startCoords.lng,
          },
          end: {
            address: endAdd,
            lat: endCoords.lat,
            lng: endCoords.lng,
          },
          lyft,
          uber,
        };
        axios.post('/postLocation', data)
          .then(() => console.log('Posted!'))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  login() {
    axios.get('/api/login')
      .then((data) => {
        this.setState({
          login: true,
          uberURL: data.data,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const {
      login,
      map,
      lyft,
      uber,
      uberURL,
    } = this.state;
    return (
      <div>
        <button type="button" onClick={this.login}>Log In</button>
        {login
          ? (
            <div>
              <a href={uberURL} className="button">Uber Login</a>
              <a href="https://lyft.com" className="button">Lyft Login</a>
            </div>
          )
          : <div />
        }
        <form>
          <input type="text" onChange={e => this.handleStart(e)} placeholder="Start Address" />
          <input type="text" onChange={e => this.handleEnd(e)} placeholder="End Address" />
          <button type="button" onClick={this.comparePrices}>Compare Prices!</button>
        </form>
        <div>Hello React!</div>
        <div>{login + map}</div>
        <div id="compare" className="hello">
          {
            lyft.length > 0
              ? (
                <div id="lyft">
                  <img src="/lyftlogo" alt="Lyft Logo" height="120" width="180" />
                  {lyft.map(ride => (
                    <div>
                      {`${ride.display_name} | $${(ride.estimated_cost_cents_min / 100)}-${(ride.estimated_cost_cents_max / 100)} | ${convertSeconds(ride.estimated_duration_seconds)}`}
                    </div>
                  ))}
                </div>)
              : <div />
          }
          {
            uber.length > 0
              ? (
                <div id="uber">
                  <img src="/uberlogo" alt="Uber Logo" height="120" width="180" />
                  {uber.map(ride => (
                    <div>
                      {`${ride.localized_display_name} | ${ride.estimate} | ${ride.distance} | ${convertSeconds(ride.duration)}`}
                    </div>
                  ))}
                </div>)
              : <div />
          }

        </div>
      </div>
    );
  }
}

export default App;
