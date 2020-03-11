const route = "bu/api";
const port = 4400;
const useREST = true;
const { Service } = require("sht-tasks");
const server = Service.Server();

require("./buAPI/Users/Users");
require("./buAPI/Stats/Stats");
require("./buAPI/Courts/Courts");

Service.startService({ route, port, useREST });
