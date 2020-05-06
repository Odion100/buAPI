require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then((data) => console.log("mongodb connected:-->"))
  .catch((err) => console.log("mongodb connection failed:-->", err));

const { App } = require("sht-tasks");
const route = "bu/api/gamedata";
const port = 4200;
const useREST = true;

require("./GameState/GameState.api");
//require("./EventFeed/EventFeed.api");

App.startService({ route, port, useREST })

  .loadService("Basketball", {
    route: "bu/api/basketball",
    port: 4100,
    host: "localhost",
  })

  .on("init_complete", () => process.send("ready"));
