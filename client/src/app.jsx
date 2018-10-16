import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyft: [],
      uber: [],
      start: '',
      end: '',
      login: false,
    };

    this.comparePrices = this.comparePrices.bind(this);
    this.checkLyft = this.checkLyft.bind(this);
    this.checkUber = this.checkUber.bind(this);
    this.login = this.login.bind(this);
    this.test = this.test.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.convertSeconds = this.convertSeconds.bind(this);
  }

  handleStart(e) {
    this.state.start = e.target.value;
  }

  handleEnd(e) {
    this.state.end = e.target.value;
  }

  convertSeconds(time) {
    return `${Math.floor(time / 60)} min`
  }

  test() {
    console.log(this.state.start);
    console.log(this.state.end);
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
        console.log(locations);
        this.checkLyft(locations.start, locations.end);
        this.checkUber(locations.start, locations.end);
      })
      .catch(err => console.log(err));
  }

  checkLyft(start, end) {
    console.log(start, end);
    axios.get('/checkLyft', {
      params: { start, end },
    })
      .then(data => this.setState({
        lyft: data.data,
      }))
      .catch(err => console.log(err));
  }

  checkUber(start, end) {
    console.log(start, end);
    axios.get('/checkUber', {
      params: { start, end },
    })
      .then(data => this.setState({
        uber: data.data,
      }))
      .catch(err => console.log(err));
  }

  login() {
    axios.get('/api/login')
      .then(() => this.setState({
        login: true,
      }))
      .catch(err => console.log(err));
  }

  render() {
    const { login, lyft, uber } = this.state;
    console.log(lyft);
    return (
      <div>
        <button type="button" onClick={this.login}>Log In</button>
        <form>
          <input type="text" onChange={e => this.handleStart(e)} placeholder="Start Address" />
          <input type="text" onChange={e => this.handleEnd(e)} placeholder="End Address" />
          <button type="button" onClick={this.comparePrices}>Compare Prices!</button>
          <button type="button" onClick={this.test}>Test</button>
        </form>
        <div>Hello React!</div>
        <div id="compare" className="hello">
          {
            lyft
              ? (
                <div id="lyft">
                  <img src="/lyftlogo" alt="Lyft Logo" height="120" width="180" />
                  {lyft.map(ride => (
                    <div>
                      {`${ride.display_name} | $${(ride.estimated_cost_cents_min / 100)}-${(ride.estimated_cost_cents_max / 100)} | ${this.convertSeconds(ride.estimated_duration_seconds)}`}
                    </div>
                  ))}
                </div>)
              : <div />
          }
          {
            uber
              ? (
                <div id="uber">
                  <img src="/uberlogo" alt="Uber Logo" height="120" width="180" />
                  {uber.map(ride => (
                    <div>
                      {`${ride.localized_display_name} | ${ride.estimate} | ${ride.distance} | ${this.convertSeconds(ride.duration)}`}
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
