const { App } = require("sht-tasks");

const route = "bu/api/networking";
const port = 4000;
const useREST = true;

require("dotenv").config();
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
  if (typeof process.send === "fuction") process.send("ready");
});
