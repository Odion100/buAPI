const { Service } = require("sht-tasks");

Service.ServerModule("ActivityFeed", function() {
  const ActivityFeed = this;

  ActivityFeed.get = (data, cb) => cb(null, { message: "You called user.get method" });

  ActivityFeed.add = (data, cb) => cb(null, { message: "You called user.add method" });

  ActivityFeed.update = (data, cb) => cb(null, { message: "You called user.update method" });

  ActivityFeed.archive = (data, cb) => cb(null, { message: "You called user.archive method" });

  ActivityFeed.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});

module.exports = Service;
