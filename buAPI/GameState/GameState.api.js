const { App } = require("sht-tasks");

const gameStateModel = require("./GameState.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("GameState", function () {
  const GameState = this;

  GameState.initialize = (game, cb) => {
    new gameStateModel({ _id: Types.ObjectId(), ...game })
      .save()
      .then((newGameState) =>
        cb(null, { newGameState, status: 200, message: "New GameState created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new GameState" }));
  };
  GameState.get = ({ id, game }, cbu) => {};

  GameState.startPlay = (data, cb) => {};

  GameState.addPlay = (data, cb) => {
    //update game state
  };

  GamesState.updatePlayers = () => {
    //who's in the game
    //who's on the bench
  };
  GameState.pause = (data, cb) => {};

  GameState.endGame = (data, cb) => {
    //when the game is ended fire an event
    //PlayerStats, TeamStats and TourniStats will respond to
    // this local event to update their data
  };
});
