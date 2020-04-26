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

  .on("init_complete", () => process.send("ready"));
