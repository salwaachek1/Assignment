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
    history: [],
    winning_ratio: null,
    most_played: "",
    number_games_played: "",
    msg: "wait a second ...",
    name: "",
    element: "",
  };
  /* get calculation from laravel api : ratio,number of games played,most played */
  getHistory = async (name) => {
    this.setState({ name: name });
    this.setState({ msg: "wait a second ..." });
    const response = await axios.get(
      "http://localhost/Assignment-API-master/public/api/getHistory/" + name
    );
    this.setState({ history: response.data.games_played });
    this.setState({ winning_ratio: response.data.ratio });
    this.setState({ number_games_played: response.data.count });
    this.setState({ msg: "" });
    this.setState({ most_played: response.data.most_played });
    var element = "";
    if (this.state.most_played == "Paper") {
      element = (
        <i
          className="material-icons"
          style={{ fontSize: "80px", marginTop: "10px" }}
        >
          description
        </i>
      );
    } else if (this.state.most_played == "Scissors") {
      element = (
        <i
          className="material-icons"
          style={{ fontSize: "80px", marginTop: "10px" }}
        >
          content_cut
        </i>
      );
    } else if (this.state.most_played == "Rock") {
      element = (
        <i
          className="material-icons"
          style={{ fontSize: "80px", marginTop: "10px" }}
        >
          all_out
        </i>
      );
    }
    this.setState({ element: element });
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
    this.setState({ history: [] });
    this.getHistory(name);
  };
  displayPlayerHistoryPlayerB = (name) => {
    // this.displayPlayerHistory(name); //this is if we did calculation of games on the client side
    this.setState({ history: [] });
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
      <div
        className="col-md-6"
        style={{
          overflowY: " scroll",
          height: "40vw",
          border: "1px solid #949A9D",
        }}
      >
        {" "}
        <Games_list
          type="ties"
          games={this.state.games_ties}
          displayPlayerHistoryPlayerA={this.displayPlayerHistoryPlayerA}
          displayPlayerHistoryPlayerB={this.displayPlayerHistoryPlayerB}
        />
      </div>
    );

    console.log("cursor :", this.state.games_ties.cursor);
    const c2 = (
      <div
        className="col-md-6"
        style={{
          overflowY: " scroll",
          height: "40vw",
          border: "1px solid #949A9D",
        }}
      >
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
  next = (another_page) => {
    this.state.number_page = this.state.number_page + 1;
    this.displayLoading();
    this.setState({ page: this.state.page + 1 });
    this.displayGames(another_page);
    this.getGamesTies(another_page);
  };
  /* navigate to the previous page */
  navigate_back = (another_page) => {
    this.setState({ page: this.state.page - 1 });
    var current_page = this.state.navigation_array.indexOf(another_page);
    var previous = this.state.navigation_array[current_page - 1];
    console.log("current_page:", current_page);
    console.log("previous:", current_page);
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
    }
    this.setState({ prev: another_page });
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
    // console.log("data :", this.state.games);
    // console.log("array of navigation :", this.state.navigation_array);
    var content = "";
    if (this.state.msg == "") {
      content = (
        <div>
          <div className="row">
            <div className="col-md-4" style={{ textAlign: "center" }}>
              Winning Ratio
              <i
                className="material-icons"
                style={{ fontSize: "80px", marginTop: "10px" }}
              >
                emoji_events
              </i>
              <div>{this.state.winning_ratio}</div>
            </div>
            <div className="col-md-4" style={{ textAlign: "center" }}>
              Number Of Games
              <i
                className="material-icons"
                style={{ fontSize: "80px", marginTop: "10px" }}
              >
                format_list_numbered
              </i>
              <div>{this.state.number_games_played}</div>
            </div>
            <div className="col-md-4" style={{ textAlign: "center" }}>
              Most Element Played
              {this.state.element}
              <div>{this.state.most_played}</div>
            </div>
          </div>{" "}
          <Games_list
            type=""
            games={this.state.history}
            displayPlayerHistoryPlayerA={this.displayPlayerHistoryPlayerA}
            displayPlayerHistoryPlayerB={this.displayPlayerHistoryPlayerB}
          />
        </div>
      );
    }
    var back = "";
    if (this.state.page !== 0) {
      back = (
        <i
          className="material-icons"
          style={{ cursor: "pointer" }}
          onClick={() => this.navigate_back(this.state.prev)}
        >
          arrow_back_ios
        </i>
      );
    }
    return (
      <div className="row" style={{ backgroundColor: "#eee" }}>
        <div className="col-md-12">
          <div id="loading" style={{ textAlign: "center" }}></div>
        </div>
        <div className="col-md-12" style={{ textAlign: "center" }}>
          <table style={{ width: "50%" }}>
            <tr>
              <td>{back}</td>
              <td> page {this.state.page}</td>
              <td>
                {" "}
                <i
                  className="material-icons"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.next(this.state.previous_games)}
                >
                  arrow_forward_ios
                </i>
              </td>
            </tr>
          </table>
        </div>
        <div className="col-md-12">
          {this.state.ties}
          {this.state.old_games}
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="myModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ textAlign: "center" }}>
                <i className="material-icons" style={{ fontSize: "80px" }}>
                  person
                </i>
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{
                    textAlign: "center",
                    color: "grey",
                    fontWeight: "bold",
                  }}
                >
                  {this.state.name}
                </h5>
              </div>
              <div
                className="modal-body"
                style={{ overflowY: " scroll", height: "20vw" }}
              >
                {content}
                <div style={{ textAlign: "center", color: "#a8cdff" }}>
                  {this.state.msg}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
