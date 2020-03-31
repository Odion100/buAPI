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

module.exports = model(
  "Tournaments",
  Schema({
    _id: Schema.Types.ObjectId,
    uid: {
      type: String,
      default: function() {
        return `${this.root_admin}-${this.name}`;
      },
      unique
    },
    profile_image: String,
    banner_image: String,
    name: { type: String, required },
    root_admin: { type: Schema.Types.ObjectId, required },
    secondary_admins: [{ type: Schema.Types.ObjectId }],
    primary_zipcodes: [String],
    teams: [{ type: Schema.Types.ObjectId }],
    team_limit: Number,
    created_date: { type: Date, default: moment().toJSON() },
    status: {
      type: String,
      default: "unpublished",
      enum: ["unpublished", "published", "in progress", "canceled", "paused", "completed"]
    },
    type: { type: String, enum: ["1 on 1", "2 on 2", "3 on 3", "4 on 4", "5 on 5"] },
    rules: [String],
    refereed: { type: Boolean, default: false },
    rounds: { type: Number, enum: [1, , 2, 3, 4], default: 1 },
    round_clock: { type: Number, default: 0 },
    description: String,
    start_date: Date,
    end_date: Date
  }).pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };

    CONSTANTS.forEach(field => {
      if (update.$set[field]) throw `${field} field modification not allowed`;
    });
    next();
  })
);
