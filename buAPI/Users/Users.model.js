const { Schema, model } = require("mongoose");
const moment = require("moment");
const required = true;
const unique = true;
const CONSTANTS = ["email", "password", "created_date", "_id", "account_status"];

module.exports = model(
  "Users",
  Schema({
    _id: Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    age: String,
    gender: String,
    profile_image: String,
    banner_image: String,
    email: { type: String, required, unique },
    password: { type: String, required },
    created_date: { type: Date, default: moment().toJSON() },
    main_zipcode: String,
    tag: String,
    account_status: { type: String, default: "Active" }
  }).pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };

    CONSTANTS.forEach(field => {
      if (update.$set[field]) {
        throw `${field} field modification not allowed`;
      }
    });
    next();
  })
);
