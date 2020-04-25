const { Service } = require("sht-tasks");

Service.ServerModule("NewsFeed", function() {
  const NewsFeed = this;

  NewsFeed.get = (data, cb) => cb(null, { message: "You called user.get method" });

  NewsFeed.add = (data, cb) => cb(null, { message: "You called user.add method" });

  NewsFeed.update = (data, cb) => cb(null, { message: "You called user.update method" });

  NewsFeed.archive = (data, cb) => cb(null, { message: "You called user.archive method" });

  NewsFeed.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});

module.exports = Service;
