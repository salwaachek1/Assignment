import React, { Component } from "react";
import Game_list_item from "./Game_list_item";

class Games_list extends Component {
  displayPlayerHistoryPlayerA = (name) => {
    this.props.displayPlayerHistoryPlayerA(name);
  };
  displayPlayerHistoryPlayerB = (name) => {
    this.props.displayPlayerHistoryPlayerB(name);
  };

  render() {
    const games = this.props.games;
    const type = this.props.type;
    var title = "Finished Games";
    if (type == "ties") {
      title = "Ongoing games";
    }
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#a8cdff",
            width: "100%",
            padding: "10px",
            margin: "10px",
          }}
        >
          {title}
        </div>
        <table className="ui celled table" style={{ width: "100%" }}>
          <thead>
            <th>ID Game</th>
            <th>winner</th>
            <th>Player A</th>
            <th>Player B</th>
          </thead>
          <tbody>
            {games.map((game) => {
              return (
                <Game_list_item
                  key={game.gameId}
                  game={game}
                  type={type}
                  displayPlayerHistoryPlayerA={this.displayPlayerHistoryPlayerA}
                  displayPlayerHistoryPlayerB={this.displayPlayerHistoryPlayerB}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Games_list;
