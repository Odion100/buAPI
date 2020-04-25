require("./node_modules/dotenv").config();
const route = "bu/api/networking";
const port = 4000;
const useREST = true;
const { App } = require("./node_modules/sht-tasks");
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then((data) => console.log("mongodb connected:-->"))
  .catch((err) => console.log("mongodb connection failed:-->", err));

require("./Invites/Invites.api");
//require("./EventFeed/EventFeed.api");

App.startService({ route, port, useREST }).on("init_complete", () => {
  console.log("let then know you ready networking service");
});
