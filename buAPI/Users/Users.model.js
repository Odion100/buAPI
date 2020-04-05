const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidations");
const CONSTANT_FIELDS = ["email", "password", "created_date", "_id", "account_status"];
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
    .pre("findOneAndUpdate", function(next) {
      const update = this.getUpdate();
      if (!update.$set) throw { message: "Internal Error: Expected update to use $set" };

      CONSTANT_FIELDS.forEach(field => {
        if (update.$set[field]) {
          throw { message: `${field} field modification not allowed`, status: 403 };
        }
      });
      next();
    })
);
