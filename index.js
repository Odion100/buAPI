require("dotenv").config();
const route = "bu/api";
const port = 7899;
const useREST = true;
const { App } = require("sht-tasks");
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://Odion:${process.env.MONGODB_PASSWORD}@cluster0-8s7lw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(data => console.log("mongodb connected:-->"))
  .catch(err => console.log("mongodb connection failed:-->", err.massage));

require("./buAPI/Users/Users");
require("./buAPI/Tournaments/Tournaments");
require("./buAPI/Stats/Stats");
require("./buAPI/Courts/Courts");
require("./buAPI/NewsFeed/NewsFeed");
require("./buAPI/ActivityFeed/ActivityFeed");
require("./buAPI/Notifications/Notifications");
require("./buAPI/Messanger/Messanger");
require("./buAPI/Games/Games");
require("./buAPI/Broadcasts/Broadcasts");
require("./buAPI/Filestore/Filestore");

App.startService({ route, port, useREST });
