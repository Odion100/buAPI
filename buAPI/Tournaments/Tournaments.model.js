const { Schema, model } = require("mongoose");
const moment = require("moment");
const required = true;
const unique = true;
const CONSTANTS = [
  "created_date",
  "_id",
  "status",
  "root_admin",
  "teams",
  "secondary_admins",
  "name",
  "uid"
];
const immutable = doc => this.status !== "unpublished";

module.exports = model(
  "Tournaments",
  Schema({
    _id: Schema.Types.ObjectId,
    uid: {
      type: String,
      default: function() {
        return `${this.root_admin}-${this.name}`;
      },
      unique,
      immutable: true
    },
    profile_image: String,
    banner_image: String,
    name: { type: String, required },
    root_admin: { type: Schema.Types.ObjectId, required },
    secondary_admins: [{ type: Schema.Types.ObjectId }],
    primary_zipcodes: [String],
    description: String,
    created_date: { type: Date, default: moment().toJSON() },
    status: {
      type: String,
      default: "unpublished",
      enum: ["unpublished", "published", "in progress", "canceled", "paused", "completed"]
    },
    teams: [{ type: Schema.Types.ObjectId, immutable }],
    team_limit: { type: Number, immutable },
    type: { type: String, enum: ["1 on 1", "2 on 2", "3 on 3", "4 on 4", "5 on 5"], immutable },
    rules: { type: [String], immutable },
    refereed: { type: Boolean, default: false, immutable },
    rounds: { type: Number, enum: [1, 2, 3, 4], default: 1, immutable },
    round_clock: { type: Number, default: 0, immutable },
    start_date: { type: Date, immutable },
    end_date: { type: Date, immutable }
  }).pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };
    CONSTANTS.forEach(field => {
      if (update.$set[field]) throw `${field} field modification not allowed`;
    });
    next();
  })
);
