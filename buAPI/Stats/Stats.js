const { Service } = require("sht-tasks");

Service.ServerModule("stats", function() {
  const stats = this;

  stats.get = (data, cb) => cb(null, { message: "You called user.get method" });

  stats.put = (data, cb) => cb(null, { message: "You called user.put method" });

  stats.post = (data, cb) => cb(null, { message: "You called user.post method" });
});

module.exports = Service;
