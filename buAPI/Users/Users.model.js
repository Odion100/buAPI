const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const lowercase = true;
const required = true;
const unique = true;

module.exports = model(
  "Users",
  Schema({
    _id: Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    age: Number,
    gender: String,
    profile_image: String,
    banner_image: String,
    email: { type: String, required, unique },
    password: { type: String, required },
    created_date: { type: Date, default: moment().toJSON() },
    primary_zipcodes: [String],
    tag: String,
    account_status: { type: String, default: "active", enum: ["active", "archived"], lowercase }
  })
    .pre("findOne", queryValidations)
    .pre(
      "findOneAndUpdate",
      constantsValidator(["email", "password", "created_date", "_id", "account_status"])
    )
);
