const { Schema, model } = require("mongoose");
const moment = require("moment");
const required = true;
const unique = true;
const CONSTANTS = ["created_date", "_id", "status", "root_admin"];

module.exports = model(
  "Tournaments",
  Schema({
    _id: Schema.Types.ObjectId,
    profile_image: String,
    banner_image: String,
    name: { type: String, required },
    root_admin: { type: Schema.Types.ObjectId, required },
    secondary_admins: [{ type: Schema.Types.ObjectId, required }],
    primary_zipcodes: [String],
    teams: [{ type: Schema.Types.ObjectId }],
    created_date: Date,
    status: String
  }).pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };

    CONSTANTS.forEach(field => {
      if (update.$set[field]) throw `${field} field modification not allowed`;
    });
    next();
  })
);
