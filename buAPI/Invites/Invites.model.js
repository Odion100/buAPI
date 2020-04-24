const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_sharedValidators/queryValidator");
const constantsValidator = require("../_sharedValidators/constantsValidator");
const required = true;
const immutable = true;

module.exports = model(
  "Invites",
  Schema({
    _id: Schema.Types.ObjectId,
    created_date: { type: Date, default: moment().toJSON(), immutable },
    source_type: { type: String, enum: ["tournaments", "teams", "users"], required },
    source: { type: Schema.Types.ObjectId, required },
    target_type: { type: String, enum: ["teams", "users"], required },
    target: { type: Schema.Types.ObjectId, required },
    invitation_message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["sent", "accepted", "rejected", "canceled"],
      default: "sent",
    },
    type: { type: String, require },
    response_message: { type: String, default: "" },
    response_date: Date,
    viewed_date: Date,
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "teams", "name"]))
);
