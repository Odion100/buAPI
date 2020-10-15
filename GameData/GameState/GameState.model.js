const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../../_sharedValidators/queryValidator");
const required = true;
const immutable = true;
const unique = true;
const select = false;
const validate = {
  validator: function (value) {
    return value.length >= this.team_size;
  },
  message: "Team size is too small",
};
module.exports = model(
  "GameState",
  Schema({
    _id: Schema.Types.ObjectId,
    //Game Settings
    team_size: { type: Number, required, immutable },
    clock_duration: { type: Number, required, immutable },
    overtime_duration: { type: Number, required, immutable },
    total_quarters: { type: Number, required, immutable },
    timeouts_per_quarter: { type: Number, required },

    //Live game status
    game_start_time: { type: Date, default: moment().toJSON(), immutable },
    gameplay_clock: { type: Number, default: 0 },
    gameplay_status: {
      type: String,
      enum: [
        "in play",
        "team-timeout",
        "refs-timeout",
        "game-timeout",
        "completed",
        "intermission",
      ],
      default: "intermission",
    },
    current_quarter: { type: Number, default: 0 },
    quarters: [
      {
        number: { type: Number, required },
        start_time: { type: Date, required, default: moment().toJSON() },
        end_time: { type: Date },
        timeout_duration: { type: Number, default: 0 },
      },
    ],

    //team 1 GAME PLAY STATE
    team1_id: { type: Schema.Types.ObjectId, required, immutable },
    team1_roster: { type: [Schema.Types.ObjectId], validate, required, immutable },
    team1_active_players: [Schema.Types.ObjectId],
    team1_timeouts_used: [{ quarter: { type: Number, required }, clock: { type: Date, required } }],
    //STATS
    team1_rebounds: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_steals: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_blocks: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_turnovers: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_assists: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_fouls: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team1_points: [
      {
        player: { type: Schema.Types.ObjectId, required },
        points: { type: Number, required },
        date: { type: Date, required },
      },
    ],
    //team 2 GAME PLAY STATE
    team2_id: { type: Schema.Types.ObjectId, required, immutable },
    team2_roster: { type: [Schema.Types.ObjectId], validate, required, immutable },
    team2_active_players: [Schema.Types.ObjectId],
    team2_timeouts_used: [{ quarter: { type: Number, required }, date: { type: Date, required } }],
    //STATS
    team2_rebounds: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_steals: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_blocks: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_turnovers: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_assists: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_fouls: [
      { player: { type: Schema.Types.ObjectId, required }, date: { type: Date, required } },
    ],
    team2_points: [
      {
        player: { type: Schema.Types.ObjectId, required },
        amount: { type: Number, required },
        date: { type: Date, required },
      },
    ],
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
);
