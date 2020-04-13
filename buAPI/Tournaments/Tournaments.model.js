const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const unique = true;
const immutable = true;

module.exports = model(
  "Tournaments",
  Schema({
    //Immutables
    _id: Schema.Types.ObjectId,
    uid: {
      type: String,
      default: function () {
        return `${this.root_admin}-${this.name}`;
      },
      unique,
      immutable,
    },

    root_admin: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },

    //Constants
    name: { type: String, required },
    teams: [{ type: Schema.Types.ObjectId }],
    status: {
      type: String,
      default: "unpublished",
      enum: ["unpublished", "published", "in progress", "canceled", "paused", "completed"],
    },

    //Non Constants
    profile_image: String,
    banner_image: String,
    secondary_admins: [{ type: Schema.Types.ObjectId, unique }],
    primary_zipcodes: [String],
    description: String,

    //Constants by status
    team_limit: { type: Number, default: 2, min: 2 },
    type: { type: String, enum: ["1 on 1", "2 on 2", "3 on 3", "4 on 4", "5 on 5"] },
    rules: { type: [String] },
    refereed: { type: Boolean, default: false },
    rounds: { type: Number, enum: [1, 2, 3, 4], default: 1 },
    clock: { type: Number, default: 0 },
    start_date: { type: Date },
    end_date: { type: Date },
  })
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "teams", "name"]))
);
