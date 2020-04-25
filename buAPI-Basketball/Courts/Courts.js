const { Service } = require("sht-tasks");

Service.ServerModule("courts", function() {
  const courts = this;

  courts.get = (data, cb) => cb(null, { message: "You called user.get method" });

  courts.put = (data, cb) => cb(null, { message: "You called user.put method" });

  courts.post = (data, cb) => cb(null, { message: "You called user.post method" });
});

module.exports = Service;
