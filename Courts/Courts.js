const { Service } = require("sht-tasks");

Service.ServerModule("courts", function() {
  const users = this;

  users.get = (data, cb) => cb(null, { message: "You called user.get method" });

  users.put = (data, cb) => cb(null, { message: "You called user.put method" });

  users.post = (data, cb) => cb(null, { message: "You called user.post method" });
});

module.exports = Service;
