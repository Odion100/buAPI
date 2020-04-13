const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const immutable = true;

module.exports = model(
  "Games",
  Schema({
    _id: Schema.Types.ObjectId,
    creator: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },

    team1: { type: Schema.Types.ObjectId, required, immutable },
    team2: { type: Schema.Types.ObjectId, required, immutable },
    court: { type: Schema.Types.ObjectId, required, immutable },

    start_date: Date,
    status: {
      type: String,
      enum: ["pending", "confirmed", "in progress", "completed", "canceled"],
      default: "pending",
    },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
);
