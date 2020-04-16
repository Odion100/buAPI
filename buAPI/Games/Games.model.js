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
    status: {
      type: String,
      enum: ["unpublished", "published", "in progress", "completed", "canceled"],
      default: "unpublished",
    },
    tags: [String],
    team_size: { type: Number, max: 5 },
    rules: String,
    rounds: { type: Number, default: 1, min: 1, max: 4 },
    clock: { type: Number, default: 0 },
    overtime_clock: { type: Number, default: 0 },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status"]))
);
