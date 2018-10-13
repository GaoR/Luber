import React, { Component } from 'react';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyft: [],
      uber: [],
    };

    this.checkLyft = this.checkLyft.bind(this);
  }

  componentDidMount() {
    // this.checkLyft();
  }

  checkLyft() {
    axios.get('/checkLyft')
      .then(data => this.setState({
        lyft: data.data,
      }))
      .catch(err => console.log(err));
  }

  checkUber() {
    axios.get('/checkUber')
      .then(data => this.setState({
        uber: data.data,
      }))
      .catch(err => console.log(err));
  }

  render() {
    const { lyft, uber } = this.state;
    console.log(lyft);
    return (
      <div>
        <button type="button" onClick={this.checkLyft}>Check Lyft</button>
        <button type="button" onClick={this.checkUber}>Check Uber</button>
        <div>Hello React!</div>
        <div>
          {lyft.map(ride => (
            <div>
              {`${ride.display_name} | $${(ride.estimated_cost_cents_min + ride.estimated_cost_cents_max) / 200} | ${ride.estimated_duration_seconds}s`}
            </div>
          ))}
        </div>
        <div>
          {uber.map(ride => (
            <div>{ride}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
