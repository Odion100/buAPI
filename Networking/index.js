const { App } = require("sht-tasks");

const route = "bu/api/networking";
const port = 4000;
const useREST = true;

require("./Invites/Invites.api");
//require("./EventFeed/EventFeed.api");

App.startService({ route, port, useREST }).on("init_complete", () => process.send("ready"));
