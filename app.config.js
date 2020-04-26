require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then((data) => console.log("mongodb connected:-->"))
  .catch((err) => console.log("mongodb connection failed:-->", err));

module.exports = {
  apps: [
    {
      script: "buAPI-Networking",
      watch: true,
      wait_ready: false,
    },
    {
      script: "buAPI-Basketball",
      watch: true,
      wait_ready: true,
    },
  ],
};
