const route = "bu/api";
const port = 4400;
const useREST = true;
const { Service } = require("sht-tasks");
const server = Service.Server();

require("./Users/Users");
require("./Stats/Stats");
require("./Courts/Courts");

Service.startService({ route, port, useREST });
