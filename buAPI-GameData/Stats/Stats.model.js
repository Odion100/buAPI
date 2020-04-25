const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const required = true;
const immutable = true;
const unique = true;
const select = false;

module.exports = model(
  "Stats",
  Schema({
    //Immutables
    _id: Schema.Types.ObjectId,
    date: { type: Date, default: moment().toJSON(), immutable },
    game: { type: Schema.Types.ObjectId, required },
    player: { type: Schema.Types.ObjectId, required },
    team: { type: Schema.Types.ObjectId, required },
    stat: {
      type: String,
      enum: ["1p", "2p", "3p", "foul", "steal", "block", "assist", "turnover"],
      required,
    },
    highlight_type: {
      type: String,
      enum: ["none", "dunk", "long 3", "game winner"],
      default: "none",
    },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
);
