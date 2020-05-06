const { App } = require("sht-tasks");

const gameStateModel = require("./GameState.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("GameState", function () {
  const GameState = this;
  const { Teams } = this.useService("Basketball");

  GameState.initialize = async (game, cb) => {
    //console.log(game);
    if (!game.team1 || !game.team2)
      return cb({
        message: "Invalid Options: team1 and team2 or required options",
        status: 404,
      });

    try {
      const { teams } = await Teams.get({ ids: [game.team1, game.team2] });
      const t1 = teams.find((team) => team._id === game.team1);
      if (!t1) return cb({ message: `Invalid Team1 id: ${game.team1}` });
      const t2 = teams.find((team) => team._id === game.team2);
      if (!t2) return cb({ message: `Invalid Team2 id: ${game.team2}` });

      const team1_roster = t1.players;
      const team2_roster = t2.players;

      new gameStateModel({
        _id: Types.ObjectId(),
        ...game,
        team1_roster,
        team2_roster,
      })
        .save()
        .then((newGameState) =>
          cb(null, { newGameState, status: 200, message: "New GameState created successfully." })
        )
        .catch((error) => cb({ error, status: 400, message: "Failed to create new GameState" }));
    } catch (error) {
      console.log(error);
      cb(error);
    }
  };

  GameState.get = ({ id }, cb) => {
    const queries = [];
    if (id) queries.push({ _id: id });

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

  GameState.updatePlayers = async ({ id, team_id, active_players, bench_players }, cb) => {
    try {
      const gameState = await gameStateModel.findById(id);
      if (!gameState) return cb({ status: 404, message: "GameState not found" });
      const team =
        team_id === gameState.team1 ? "team1" : team_id === gameState.team2 ? "team2" : null;

      if (!team)
        return cb({
          status: 404,
          message: "team_id does not match the teams assigned to this game",
        });

      //validate active team and bench team
      if (active_players.length + bench_players.length !== gameState[`${team}_roster`].length)
        return cb({ status: 404, message: "that data sent does not match the teams roster" });

      if (
        ![...active_players, ...bench_players].every(
          (player) => gameState[`${team}_roster`].indexOf(player) > -1
        )
      )
        return cb({ status: 404, message: "The data sent does not match the teams roster" });

      gameState[`${team}_active_players`] = active_players;
      gameState[`${team}_bench_players`] = bench_players;
      gameState
        .save()
        .then((updatedGameState) => cb(null, { updatedGameState, status: 200 }))
        .catch((error) => cb(error));
    } catch (error) {
      cb(error);
    }
  };

  GameState.startPlay = async ({ id }, cb) => {
    //check the active players
    try {
      const gameState = await gameStateModel.findById(id);
      if (!gameState) return cb({ status: 404, message: "GameState not found" });

      if (gameState.team1_active_players.length !== gameState.team_size)
        return cb({
          status: 403,
          message: "Team1 active players do not match the designated team size",
        });

      if (gameState.team2_active_players.length !== gameState.team_size)
        return cb({
          status: 403,
          message: "Team2 active players do not match the designated team size",
        });

      switch (gameState.gameplay_status) {
        case "in play":
          return cb({ status: 404, message: "GameState status is already in play" });
        case "completed":
          return cb({ status: 404, message: "GameState status is already completed" });
        case "team-timeout":
        case "refs-timeout":
        case "game-timeout":
          break;

        case "intermission":
          gameState.current_quarter++;
          gameState.quarters.push({ number: gameState.current_quarter });
          gameState.gameplay_clock = 0;
          break;

        default:
          return cb({
            status: 500,
            message: `Invalid GameState status: ${gameState.gameplay_status} is not a valid status`,
          });
      }
      gameState.gameplay_status = "in play";
      gameState
        .save()
        .then((updatedGameState) => cb(null, { updatedGameState, status: 200 }))
        .catch((error) => cb(error));
    } catch (error) {
      cb(error);
    }
  };

  GameState.addPlay = (data, cb) => {
    //update game state
  };
  GameState.endPlay = (data, cb) => {
    //update game state
  };

  GameState.pause = (data, cb) => {};

  GameState.endGame = (data, cb) => {
    //when the game is ended fire an event
    //PlayerStats, TeamStats and TourniStats will respond to
    // this local event to update their data
  };
});
