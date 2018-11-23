import React, { Component } from "react";
import { PulseLoader } from 'react-spinners';
import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartBar } from '@fortawesome/free-solid-svg-icons';
import API from './utils/API';

library.add(faArrowLeft, faChartBar);

class App extends Component {
  state = {
    runningSimulation: false,
    simComplete: false,
    allTickets: [],
    draws: [],
    simCounts: {},
    totalWinners: 0,
  }
  componentDidMount() {
    API.initialize()
      .then(res => {
        console.log(res.data);
        this.setState({ allTickets: res.data.allTickets });
      });
  }

  handleMainButtonClick = (e) => {
    e.preventDefault();
    this.setState({ runningSimulation: true, simComplete: false });
    this.start = new Date();
    API.doSimulation()
      .then(res => {
        this.end = new Date();
        console.log(res.data);
        this.setState({
          runningSimulation: false,
          simComplete: true,
          draws: res.data.draws,
          simCounts: res.data.simCounts,
          totalWinners: Object.keys(res.data.simCounts).reduce((accum, k) => accum + res.data.simCounts[k].winners, 0),
          totalEntrants: Object.keys(res.data.simCounts).reduce((accum, k) => accum + res.data.simCounts[k].entrants, 0),
          });
      });
  }

  renderResults = () => {
    if (!this.state.simComplete) return null;
    return (
      <div className="results-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Tickets</th>
              <th scope="col">Entrants</th>
              <th scope="col">Group Tally</th>
              <th scope="col">Group %</th>
              <th scope="col">Num Selected</th>
              <th scope="col">Odds %</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.simCounts).map(key =>
              <tr key={key}>
                <td>{key}</td>
                <td>{this.state.simCounts[key].entrants.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td>{this.state.simCounts[key].winners.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td>{((this.state.simCounts[key].winners / this.state.totalWinners) * 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td>{(this.state.simCounts[key].winners / this.state.draws.length).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td>{((this.state.simCounts[key].winners / this.state.draws.length) / this.state.simCounts[key].entrants * 100).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="col">Totals</th>
              <th scope="col">{this.state.totalEntrants}</th>
              <th scope="col">{this.state.totalWinners.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
              <th scope="col">{((this.state.totalWinners / this.state.totalWinners) * 100).toFixed(2)}</th>
              <th scope="col">{(this.state.totalWinners / this.state.draws.length).toFixed(2)}</th>
              <th scope="col">Odds %</th>
            </tr>
          </tfoot>
        </table>
        <div className="results-summary">
          <span className="results-summary-header">{'Simulations completed: '}</span>{this.state.draws.length}<br />
          <span className="results-summary-header">{'Average number of draws required: '}</span>{(this.state.draws
            .reduce((accum, d) => accum + d, 0) / this.state.draws.length).toFixed(2)}<br />
          <span className="results-summary-header">{'Minimum number of draws required: '}</span>{`${Math.min(...this.state.draws)}`}<br />
          <span className="results-summary-header">{'Maximum number of draws required: '}</span>{`${Math.max(...this.state.draws)}`}<br />
          <span className="results-summary-header">{'Total running time: '}</span>{`${this.end - this.start} ms`}
        </div>
      </div>
    );
  }

  renderSpinner = () => {
    if (!this.state.runningSimulation) return null;
    return (
      <div className="spinner-container">
        <PulseLoader size={36} color="#007bff" />
        <div className="spinner-text">Running Simulation...</div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-content">
        <h1>Western States Lottery Simulation</h1>
        <div className="button-container">
          <form>
            <button
              id="main-btn"
              className="btn btn-outline-primary"
              type="submit"
              onClick={this.handleMainButtonClick}
              disabled={this.state.runningSimulation}
            >
              Run Simulation
            </button>
          </form>
        </div>
        {this.renderSpinner()}
        {this.renderResults()}
      </div>
    );
  }
}

export default App;
