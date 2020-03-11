const { Service } = require("sht-tasks");
const route = "bu/api/users";
const port = 4400;

Service.ServerModule("users", function() {
  const users = this;

  users.get = (data, cb) => cb(null, { message: "You called user.get method" });

  users.put = (data, cb) => cb(null, { message: "You called user.put method" });

  users.archive = (data, cb) => cb(null, { message: "You called user.archive method" });

  users.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});
