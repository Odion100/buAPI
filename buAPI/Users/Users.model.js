const { Schema, model } = require("mongoose");
const required = true;
const unique = true;

module.exports = model(
  "Users",
  Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required },
    first_name: String,
    last_name: String,
    age: String,
    gender: String,
    profile_image: String,
    banner_image: String,
    email: { type: String, required, unique },
    password: { type: String, required },
    created_date: { type: Date, require },
    main_zipcode: String,
    tag: String
  })
);
