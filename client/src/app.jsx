import React, { Component } from 'react';
import axios from 'axios';
import Lyft from './lyftResults';
import Uber from './uberResults';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyft: [],
      uber: [],
      uberURL: '',
      start: '',
      end: '',
      startCoords: '',
      endCoords: '',
      login: false,
      recent: [],
    };

    this.comparePrices = this.comparePrices.bind(this);
    this.checkLyft = this.checkLyft.bind(this);
    this.checkUber = this.checkUber.bind(this);
    this.login = this.login.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  componentDidMount() {
    axios.get('/recentPlaces')
      .then((data) => {
        this.setState({
          recent: data.data,
        });
      })
      .catch(err => console.log(err));
  }

  setRecent(lyft, uber) {
    this.setState({ lyft, uber });
  }

  // getMap(start, end) {
  //   axios.get('/api/map', {
  //     params: { start, end },
  //   })
  //     .then(data => this.setState({
  //       map: data,
  //     }))
  //     .catch(err => console.log(err));
  // }

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

  handleStart(e) {
    this.state.start = e.target.value;
  }

  handleEnd(e) {
    this.state.end = e.target.value;
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

  checkUber(startLoc, endLoc) {
    axios.get('/checkUber', {
      params: {
        start: startLoc,
        end: endLoc,
      },
    })
      .then(data => this.setState({
        uber: data.data,
      }))
      .then(() => {
        const {
          lyft,
          uber,
          start,
          end,
          startCoords,
          endCoords,
        } = this.state;

        const data = {
          start: {
            address: start,
            lat: startCoords.lat,
            lng: startCoords.lng,
          },
          end: {
            address: end,
            lat: endCoords.lat,
            lng: endCoords.lng,
          },
          lyft,
          uber,
        };
        console.log(data);
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
      lyft,
      uber,
      uberURL,
      recent,
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
        <div>Recent Searches</div>
        {
          login
            ? (
              <div id="recent">
                {recent.map(saved => (
                  <div>
                    <button type="button" className="recentSearch" onClick={() => this.setRecent(saved.lyft, saved.uber)}>
                      {`${saved.start.address} ---> ${saved.end.address}`}
                    </button>
                  </div>
                ))}
              </div>
            )
            : <div />
        }
        <div id="compare" className="hello">
          <Lyft lyft={lyft} />
          <Uber uber={uber} />
        </div>
      </div>
    );
  }
}

export default App;
