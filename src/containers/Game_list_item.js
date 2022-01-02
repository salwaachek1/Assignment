import React, { Component } from "react";
import axios from "axios";
class Game_list_item extends Component {
  displayPlayerHistoryPlayerA = () => {
    this.props.displayPlayerHistoryPlayerA(this.props.game.playerA.name);
    console.log("first player A", this.props.game.playerA.name);
  };
  displayPlayerHistoryPlayerB = () => {
    this.props.displayPlayerHistoryPlayerB(this.props.game.playerB.name);
    console.log("first player B", this.props.game.playerB.name);
  };
  render() {
    var type = "";
    var result;
    const { gameId, playerA, playerB } = this.props.game;
    if (this.props.type == "ties") {
      type = "tie";
    } else {
      if (playerA.played == "ROCK") {
        switch (playerB.played) {
          case "PAPER":
            result = playerB.name;
            break;
          case "SCISSORS":
            result = playerA.name;
            break;
        }
      } else if (playerA.played == "PAPER") {
        switch (playerB.played) {
          case "ROCK":
            result = playerA.name;
            break;
          case "SCISSORS":
            result = playerB.name;
            break;
        }
      } else if (playerA.played == "SCISSORS") {
        switch (playerB.played) {
          case "ROCK":
            result = playerB.name;
            break;
          case "PAPER":
            result = playerA.name;
            break;
        }
      }
      type = result;
    }

    return (
      // <tr onClick={this.onCheck} >
      <tr>
        <td style={{ textAlign: "center" }}> {gameId}</td>
        <td>{type}</td>
        <td>
          <a href="#" onClick={this.displayPlayerHistoryPlayerA}>
            {playerA.name}
          </a>
        </td>
        <td style={{ textAlign: "center" }}>
          <a href="#" onClick={this.displayPlayerHistoryPlayerB}>
            {playerB.name}
          </a>
        </td>
      </tr>
    );
  }
}

export default Game_list_item;
