const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../../_sharedValidators/queryValidator");
const constantsValidator = require("../../_sharedValidators/constantsValidator");
const required = true;
const immutable = true;
const select = true;

module.exports = model(
  "Games",
  Schema({
    _id: Schema.Types.ObjectId,
    creator: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },
    team1_id: { type: Schema.Types.ObjectId, required, immutable },
    team2_id: { type: Schema.Types.ObjectId, required, immutable },
    court: { type: Schema.Types.ObjectId, required, immutable },
    team_size: { type: Number, max: 5, required },
    //constants
    status: {
      type: String,
      enum: ["unpublished", "published", "in progress", "completed", "canceled"],
      default: "unpublished",
    },
    tags: { type: [String], select },
    // constants by status
    total_quarters: { type: Number, default: 1, min: 1, max: 4 },
    clock_duration: { type: Number, default: 0 },
    overtime_duration: { type: Number, default: 0 },
    timeouts_per_quarter: { type: Number, default: 0 },
    refs: { type: Boolean, default: false },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "tags"]))
);
