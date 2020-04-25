const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const required = true;
const immutable = true;
const unique = true;
const select = false;

module.exports = model(
  "GameState",
  Schema({
    _id: Schema.Types.ObjectId,
    game: { type: Schema.Types.ObjectId, required, immutable },
    team1: { type: Schema.Types.ObjectId, required, immutable },
    team2: { type: Schema.Types.ObjectId, required, immutable },
    clock_duration: { type: Number, required },
    overtime_duration: { type: Number, required },
    total_quarters: { type: Number, required },

    game_start_time: { type: Date, default: moment().toJSON() },
    gameplay_status: {
      type: String,
      enum: ["in play", "team-timeout", "refs-timeout", "game-timeout", "completed"],
      default: "game-timeout",
    },
    current_quarter: { type: Number, default: 1 },
    quarters: [
      {
        number: { type: Number, default: 1 },
        start_time: { type: Date, required },
        end_time: { type: Date, required },
        timeout_duration: { type: Number, default: 0 },
      },
    ],
    timeouts_used: [
      {
        team: { type: Schema.Types.ObjectId, required },
        time: { type: Date, required },
        duration: Number,
        quarter: Number,
      },
    ],

    //team 1
    team1_points: { type: Number, default: 0 },
    team1_rebounds: { type: Number, default: 0 },
    team1_steals: { type: Number, default: 0 },
    team1_blocks: { type: Number, default: 0 },
    team1_turnovers: { type: Number, default: 0 },
    team1_assists: { type: Number, default: 0 },
    team1_fouls: { type: Number, default: 0 },
    team1_timeouts_remaining: Number,
    team1_player_stats: [
      {
        player: { type: Schema.Types.ObjectId, required },
        points: { type: Number, default: 0 },
        rebounds: { type: Number, default: 0 },
        steals: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        turnovers: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        fouls: { type: Number, default: 0 },
      },
    ],
    team1_active_player: [Schema.Types.ObjectId],
    team1_bench_players: [Schema.Types.ObjectId],

    //team 2
    team2_points: { type: Number, default: 0 },
    team2_rebounds: { type: Number, default: 0 },
    team2_steals: { type: Number, default: 0 },
    team2_blocks: { type: Number, default: 0 },
    team2_turnovers: { type: Number, default: 0 },
    team2_assists: { type: Number, default: 0 },
    team2_fouls: { type: Number, default: 0 },
    team2_timeouts_remaining: Number,
    team2_player_stats: [
      {
        player: { type: Schema.Types.ObjectId, required },
        points: { type: Number, default: 0 },
        rebounds: { type: Number, default: 0 },
        steals: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        turnovers: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        fouls: { type: Number, default: 0 },
      },
    ],
    team2_active_player: [Schema.Types.ObjectId],
    team2_bench_players: [Schema.Types.ObjectId],
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
);
