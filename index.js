const route = "bu/api";
const port = 4400;
const useREST = true;
const { Service } = require("sht-tasks");

require("./buAPI/Users/Users");
require("./buAPI/Stats/Stats");
require("./buAPI/Courts/Courts");
require("./buAPI/NewsFeed/NewsFeed");
require("./buAPI/ActivityFeed/ActivityFeed");
require("./buAPI/Notifications/Notifications");
require("./buAPI/Messanger/Messanger");

Service.startService({ route, port, useREST });
