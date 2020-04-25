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
  GameState.get = ({ id, game }, cb) => {
    const queries = [];
    if (id) queries.push({ _id: id });
    else if (game) queries.push({ game });

    //console.log(queries);
    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    gameStateModel
      .findOne({ $and: queries })
      .then((gameState) => cb(null, { gameState, status: 200 }))
      .catch((error) => cb(error));
  };
  GamesState.updatePlayers = async ({ id, team_id, active_players, bench_players }, cb) => {
    try {
      const gameState = await gameStateModel.findById(id);
      if (!gameState) return cb({ status: 404, message: "GameState not found" });
      const team =
        team_id === gameState.team1 ? "team1" : team_id === gameState.team2 ? "team2" : null;

      if (!team) return cb({ status: 404, message: "team_id does not match gameState" });

      //validate active team and bench team

      gameState[`${team}_active_players`] = active_players;
      gameState[`${team}_bench_players`] = bench_players;
      gameState
        .save()
        .then((updatedGameState) => cb(null, { updatedGameState, status: 200 }))
        .catch((error) => cb(error));
    } catch (error) {
      cb(error);
    }

    //who's in the game
    //who's on the bench
  };
  GameState.startPlay = (data, cb) => {};

  GameState.addPlay = (data, cb) => {
    //update game state
  };

  GameState.pause = (data, cb) => {};

  GameState.endGame = (data, cb) => {
    //when the game is ended fire an event
    //PlayerStats, TeamStats and TourniStats will respond to
    // this local event to update their data
  };
});
