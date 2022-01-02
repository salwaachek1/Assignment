import React, { Component } from "react";
import axios from "axios";
import "./app.css";
import Games_list from "../components/Games_list";
class App extends Component {
  state = {
    navigation_array: [],
    page: 0,
    count_games: 0,
    games: [],
    game: {},
    ties: "",
    old_games: "",
    games_ties: [],
    previous_games: "",
    previous: "",
    history: "",
  };
  /* get calculation from laravel api : ratio,number of games played,most played */
  getHistory = async (name) => {
    const response = await axios.get(
      "http://localhost/server_side/public/api/getHistory/" + name
    );
    this.setState({ history: response.data.count });
    console.log(" history laravel:", this.state.history);
    console.log(" games result :", response.data.result);
  };
  /* */
  // showing loading
  displayLoading() {
    const loader = document.querySelector("#loading");
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
      loader.classList.remove("display");
    }, 5000);
    this.setState({ ties: "" });
    this.setState({ old_games: "" });
  }
  displayPlayerHistoryPlayerA = (name) => {
    // this.displayPlayerHistory(name); //this is if we did calculation of games on the client side
    this.getHistory(name);
  };
  displayPlayerHistoryPlayerB = (name) => {
    // this.displayPlayerHistory(name); //this is if we did calculation of games on the client side
    this.getHistory(name);
  };

  /* this is called to count games played by a specific player */
  displayPlayerHistory = async (name) => {
    console.log("player name :", name);
    var count_games = 0;
    const API_END_POINT = "https://bad-api-assignment.reaktor.com";
    const FIRST_PAGE = "/rps/history";
    var games = await axios.get(API_END_POINT + FIRST_PAGE);
    var results = games.data;
    var next = results["cursor"]; // get the next page ID
    var ties = [];
    var all_result = results["data"];

    {
      all_result.map((game) => {
        const { gameId, playerA, playerB } = game;
        // checking if our player  was involved in the game
        if (playerA.name == name || playerB.name == name) {
          count_games = count_games + 1;
        }
      });
    }
    // loading more pages
    while (next !== null) {
      var games = await axios.get(API_END_POINT + next);
      var res = games.data;
      next = res["cursor"];
      var all_result = res["data"];

      {
        all_result.map((game) => {
          const { gameId, playerA, playerB } = game;
          if (playerA.name == name || playerB.name == name) {
            count_games = count_games + 1;
            console.log("counting games :", count_games);
          }
        });
      }
    }
    this.setState({ count_games: count_games });
    console.log("count games:", this.state.count_games);
    window.prompt(this.state.count_games);
  };
  /* */
  // hiding loading
  hideLoading() {
    const loader = document.querySelector("#loading");
    loader.classList.remove("display");
    const c1 = (
      <div className="col-md-6">
        {" "}
        <a
          style={{ cursor: "pointer" }}
          onClick={() => this.navigate_back(this.state.prev)}
        >
          Previous page {this.state.page}
        </a>
        <Games_list
          type="ties"
          games={this.state.games_ties}
          displayPlayerHistoryPlayerA={this.displayPlayerHistoryPlayerA}
          displayPlayerHistoryPlayerB={this.displayPlayerHistoryPlayerB}
          onDelete={this.onDelete}
        />
      </div>
    );

    console.log("cursor :", this.state.games_ties.cursor);
    const c2 = (
      <div className="col-md-6">
        <a
          style={{ cursor: "pointer" }}
          onClick={() => this.next(this.state.previous_games)}
        >
          Next page
        </a>
        <Games_list
          type=""
          games={this.state.games}
          displayPlayerHistoryPlayerA={this.displayPlayerHistoryPlayerA}
          displayPlayerHistoryPlayerB={this.displayPlayerHistoryPlayerB}
        />
      </div>
    );
    this.setState({ ties: c1 });
    this.setState({ old_games: c2 });
  }
  /* navigate to the next page */
  next = async (another_page) => {
    this.state.number_page = this.state.number_page + 1;
    this.displayLoading();
    this.setState({ page: this.state.page + 1 });
    this.displayGames(another_page);
    this.getGamesTies(another_page);
  };
  /* navigate to the previous page */
  navigate_back = async (another_page) => {
    this.setState({ page: this.state.page - 1 });
    var current_page = this.state.navigation_array.indexOf(another_page);
    var previous = this.state.navigation_array[current_page - 1];
    this.displayGames(previous);
    this.getGamesTies(previous);
  };
  /* get all games from a specific page (using cursor) */
  displayGames = async (another_page) => {
    this.displayLoading();
    const API_END_POINT = "https://bad-api-assignment.reaktor.com";
    var games = await axios.get(API_END_POINT + another_page);
    var results = games.data;
    this.setState({ previous_games: results["cursor"] });
    var array = this.state.navigation_array;
    if (this.state.navigation_array.indexOf(another_page) === -1) {
      array.push(another_page);
      this.setState({ navigation_array: array });
      this.setState({ prev: another_page });
    }
    var all_games = [];
    var all_result = results["data"];

    {
      all_result.map((game) => {
        const { gameId, playerA, playerB } = game;
        if (playerA.played !== playerB.played) {
          all_games.push(game);
        }
      });
    }
    this.setState({ games: all_games });
    this.hideLoading();
  };
  /*  */
  /* get all games that are a tie from a specific page (using cursor) */
  getGamesTies = async (another_page) => {
    this.displayLoading();
    const API_END_POINT = "https://bad-api-assignment.reaktor.com";
    var games = await axios.get(API_END_POINT + another_page);
    var results = games.data;
    var ties = [];
    var all_result = results["data"];

    {
      all_result.map((game) => {
        const { gameId, playerA, playerB } = game;
        /* checking if both user played the same element (paper,scissors,rock) */
        if (playerA.played == playerB.played) {
          ties.push(game);
        }
      });
    }

    console.log("ties :", ties);
    this.setState({ games_ties: ties });
    this.hideLoading();
  };

  /* NOT USED -- ONLY FOR DEMONSTRATION*/
  /* in case we want to get all ties (not by page like the function getGamesTies())*/
  getGamesRendering = async () => {
    const API_END_POINT = "https://bad-api-assignment.reaktor.com";
    var winner;
    const FIRST_PAGE = "/rps/history";
    var games = await axios.get(API_END_POINT + FIRST_PAGE);
    var results = games.data;
    var next = results["cursor"];
    var ties = [];
    var all_result = results["data"];

    {
      all_result.map((game) => {
        const { gameId, playerA, playerB } = game;
        if (playerA.played == playerB.played) {
          ties.push(game);
        }
        // console.log("player A:", playerA);
        // console.log("player B:", playerB);
      });
    }

    while (next !== "") {
      var games = await axios.get(API_END_POINT + next);
      var res = games.data;
      next = res["cursor"];
      var all_result = res["data"];

      {
        all_result.map((game) => {
          const { gameId, playerA, playerB } = game;
          if (playerA.played == playerB.played) {
            ties.push(game);
          }
        });
      }
    }
    // console.log("ties :", ties);
  };
  /* -------- */
  componentDidMount() {
    this.getHistory(); // gets us data from the LARAVEL API: ratio,number of games played, most played element
    this.displayGames("/rps/history"); // display first page games
    this.getGamesTies("/rps/history"); // display first page ties (rendering games)
  }
  render() {
    console.log("data :", this.state.games);
    console.log("array of navigation :", this.state.navigation_array);
    return (
      <div className="row">
        <div className="col-md-12">
          <div id="loading" style={{ textAlign: "center" }}></div>
        </div>
        <div className="col-md-12">
          <div style={{ display: "flex" }}>
            {this.state.ties}
            {this.state.old_games}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
