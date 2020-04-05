const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const unique = true;
const immutable = true;
const validate = {
  validator: function() {
    return this.status === "unpublished";
  },
  message: "Tournament details cannot be updated once it has been published"
};

module.exports = model(
  "Tournaments",
  Schema({
    //Immutables
    _id: Schema.Types.ObjectId,
    uid: {
      type: String,
      default: function() {
        return `${this.root_admin}-${this.name}`;
      },
      unique,
      immutable
    },
    name: { type: String, required },
    root_admin: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },

    //Constants
    teams: [{ type: Schema.Types.ObjectId, validate }],
    status: {
      type: String,
      default: "unpublished",
      enum: ["unpublished", "published", "in progress", "canceled", "paused", "completed"]
    },

    //Non Constants
    profile_image: String,
    banner_image: String,
    secondary_admins: [{ type: Schema.Types.ObjectId }],
    primary_zipcodes: [String],
    description: String,

    //validate status and Non Constant
    team_limit: { type: Number, validate },
    type: { type: String, enum: ["1 on 1", "2 on 2", "3 on 3", "4 on 4", "5 on 5"], validate },
    rules: { type: [String], validate },
    refereed: { type: Boolean, default: false, validate },
    rounds: { type: Number, enum: [1, 2, 3, 4], default: 1, validate },
    clock: { type: Number, default: 0, validate },
    start_date: { type: Date, validate },
    end_date: { type: Date, validate }
  })
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "teams", "name"]))
);
