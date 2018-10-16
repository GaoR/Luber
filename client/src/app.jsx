import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyft: [],
      uber: [],
      login: false,
    };

    this.comparePrices = this.comparePrices.bind(this);
    this.checkLyft = this.checkLyft.bind(this);
    this.checkUber = this.checkUber.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // this.checkLyft();
  }

  comparePrices(start, end) {
    axios.get('/api/geocode', {
      params: {
        start: $('#start').val()'944 Market St San Francisco CA',
        end: '44 Tehama St San Francisco CA',
      },
    })
      .then((data) => {
        const locations = {
          start: data.data.start,
          end: data.data.end,
        }
        console.log(locations);
        this.checkLyft(locations.start, locations.end);
        this.checkUber(locations.start, locations.end);
      })
      // .catch(err => console.log(err));
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
          <input type="text" placeholder="Start Address" />
          <input type="text" placeholder="End Address" />
          <button type="button" onClick={this.comparePrices}>Compare Prices!</button>
          <button type="button" onClick={this.test}>Test</button>
        </form>
        <div>Hello React!</div>
        <div id="compare" className="hello">
          <div id="lyft">
            {lyft.map(ride => (
              <div>
                {`${ride.display_name} | $${(ride.estimated_cost_cents_min / 200)} - ${(ride.estimated_cost_cents_max / 200)} | ${ride.estimated_duration_seconds}s`}
              </div>
            ))}
          </div>
          <div id="uber">
            {uber.map(ride => (
              <div>
                {`${ride.localized_display_name} | ${ride.estimate} | ${ride.distance} | ${ride.duration}s`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
