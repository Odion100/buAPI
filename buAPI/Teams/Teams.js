const { Service } = require("sht-tasks");

Service.ServerModule("Teams", function() {
  const Teams = this;

  Teams.create = (data, cb) => cb(null, { message: "You called Teams.create method" });

  Teams.get = (data, cb) => cb(null, { message: "You called Teams.get method" });

  Teams.update = (data, cb) => cb(null, { message: "You called Teams.update method" });

  Teams.cancelEvent = (data, cb) => cb(null, { message: "You called Teams.cancel method" });

  Teams.createEvent = (data, cb) => cb(null, { message: "You called Teams.reactivate method" });
});

module.exports = Service;
