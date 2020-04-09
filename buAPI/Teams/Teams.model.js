const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const immutable = true;
const unique = true;
module.exports = model(
  "Teams",
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
    root_admin: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },

    //Constants
    members: [{ type: Schema.Types.ObjectId }],
    name: { type: String, required },

    //Non Constants
    status: String,
    profile_image: String,
    banner_image: String,
    secondary_admins: [{ type: Schema.Types.ObjectId }],
    primary_zipcodes: [String],
    description: String
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["members", "name"]))
);
