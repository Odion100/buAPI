const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const immutable = true;

module.exports = model(
  "Callouts",
  Schema({
    _id: Schema.Types.ObjectId,
    creator: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },
    //easy update
    date: { type: Date, required },
    court: { type: this.schema.Types.ObjectId, required },
    public: { type: Boolean, default: true },
    description: { type: String, default: "" },
    //constants
    matchups: [Schema.Types.ObjectId],
    attendees: [Schema.Types.ObjectId],
    status: { type: String, enum: ["published", "canceled"] },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "matchups", "attendees"]))
);
