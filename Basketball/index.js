require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then((data) => console.log("mongodb connected:-->"))
  .catch((err) => console.log("mongodb connection failed:-->", err));

require("./Users/Users.api");
require("./Tournaments/Tournaments.api");
require("./Teams/Teams.api");
require("./Games/Games.api");
require("./Callouts/Callouts.api");

const { App } = require("sht-tasks");
const route = "bu/api/basketball";
const port = 4100;
const useREST = true;

App.startService({ route, port, useREST })

  .loadService("Networking", {
    route: "bu/api/networking",
    port: 4000,
    host: "localhost",
  })

  .on("init_complete", () => {
    if (typeof process.send === "function") process.send("ready");
  });
