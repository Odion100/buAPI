require("dotenv").config();
const route = "bu/api";
const port = 7899;
const useREST = true;
const { Service } = require("sht-tasks");
const mongoose = require("mongoose");

console.log("MONGODB_PASSWORD:", process.env.MONGODB_PASSWORD);
mongoose.connect(
  `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
require("./buAPI/Users/Users");
require("./buAPI/Stats/Stats");
require("./buAPI/Courts/Courts");
require("./buAPI/NewsFeed/NewsFeed");
require("./buAPI/ActivityFeed/ActivityFeed");
require("./buAPI/Notifications/Notifications");
require("./buAPI/Messanger/Messanger");
require("./buAPI/Games/Games");
require("./buAPI/Tournaments/Tournaments");
require("./buAPI/Broadcasts/Broadcasts");
require("./buAPI/Filestore/Filestore");

Service.startService({ route, port, useREST });
