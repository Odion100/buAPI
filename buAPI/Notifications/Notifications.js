const { Service } = require("sht-tasks");

Service.ServerModule("notifications", function() {
  const notifications = this;

  notifications.get = (data, cb) => cb(null, { message: "You called user.get method" });

  notifications.put = (data, cb) => cb(null, { message: "You called user.put method" });

  notifications.archiveChat = (data, cb) => cb(null, { message: "You called user.archive method" });
});

module.exports = Service;
