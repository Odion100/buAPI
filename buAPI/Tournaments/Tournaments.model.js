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
  "court_rules"
];

module.exports = model(
  "Tournaments",
  Schema({
    _id: Schema.Types.ObjectId,
    profile_image: String,
    banner_image: String,
    name: { type: String, required },
    root_admin: { type: Schema.Types.ObjectId, required },
    secondary_admins: [{ type: Schema.Types.ObjectId }],
    primary_zipcodes: [String],
    teams: [{ type: Schema.Types.ObjectId }],
    team_limit: Number,
    created_date: { type: Date, defalut: moment().toJSON() },
    status: { type: String, defalut: "pending" },
    rules: { type: Schema.Types.ObjectId, required },
    description: String,
    start_date: { type: Date, require },
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
