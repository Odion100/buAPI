const { App } = require("sht-tasks");

const gameStateModel = require("./GameState.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.module("GameState", function () {
  const GameState = this;
  const StatUnit = this.useModule("StatUnit");

  GameState.initialize = (data, cb) => {};
  GameState.update = (data, cb) => {
    //update game state
  };
  GameState.pause = (data, cb) => {};
  GameState.unpause = (data, cb) => {};
  GameState.endGame = (data, cb) => {
    //when the game is ended fire an event
    //PlayerStats, TeamStats and TourniStats will respond to
    // this local event to update thier data
  };
});
