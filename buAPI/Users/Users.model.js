const { Schema, model } = require("mongoose");
const moment = require("moment");
const required = true;
const unique = true;
const CONSTANT_FIELDS = ["email", "password", "created_date", "_id", "account_status"];
const ACCOUNT_STATUSES = ["Active", "Archived"];
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
    primary_zipcodes: [String],
    tag: String,
    account_status: { type: String, default: "Active" }
  })
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
    .pre("save", function(next) {
      if (this.isModified("account_status")) {
        if (ACCOUNT_STATUSES.indexOf(this.account_status) === -1)
          throw {
            message: `user.account status field can only accept the following values: ${ACCOUNT_STATUSES.join(
              ", "
            )}`,
            status: 403
          };
      }
      next();
    })
);
