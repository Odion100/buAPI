const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_sharedValidators/queryValidator");
const constantsValidator = require("../_sharedValidators/constantsValidator");
const lowercase = true;
const required = true;
const unique = true;
const immutable = true;
const select = false;
module.exports = model(
  "Users",
  Schema({
    _id: Schema.Types.ObjectId,
    created_date: { type: Date, default: moment().toJSON(), immutable },
    email: { type: String, required, unique, immutable },
    //constants
    password: { type: String, required, select },
    account_status: { type: String, default: "active", enum: ["active", "archived"], lowercase },
    tags: { type: [String], select },
    //non constants
    first_name: String,
    last_name: String,
    age: Number,
    gender: String,
    profile_image: String,
    banner_image: String,
    primary_zipcodes: [String],
  })
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["password", "tags", "account_status"]))
);
