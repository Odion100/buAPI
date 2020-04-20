const { Schema, model } = require("mongoose");
const moment = require("moment");
const queryValidations = require("../_utils/queryValidator");
const constantsValidator = require("../_utils/constantsValidator");
const required = true;
const immutable = true;
const unique = true;
module.exports = model(
  "Callouts",
  Schema({
    _id: Schema.Types.ObjectId,
    creator: { type: Schema.Types.ObjectId, required, immutable },
    created_date: { type: Date, default: moment().toJSON(), immutable },
    //easy update
    date: { type: Date, required },
    court: { type: Schema.Types.ObjectId, required },
    invite_only: { type: Boolean, default: false },
    description: { type: String, default: "" },
    tags: [String],
    //constants
    invitees: [{ type: Schema.Types.ObjectId, unique }],
    attendees: [{ type: Schema.Types.ObjectId, unique }],
    status: { type: String, enum: ["active", "completed", "canceled"], default: "active" },
  })
    .pre("find", queryValidations)
    .pre("findOne", queryValidations)
    .pre("findOneAndUpdate", constantsValidator(["status", "attendees", "invites"]))
);
