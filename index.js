const route = "bu/api";
const port = 4400;
const useREST = true;
const { Service } = require("sht-tasks");
require("./Users/Users");
require("./Stats/Stats");
Service.startService({ route, port, useREST });
