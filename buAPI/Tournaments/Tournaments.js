const { Service } = require("sht-tasks");

Service.ServerModule("Tournaments", function() {
  const Tournaments = this;

  Tournaments.get = (data, cb) => cb(null, { message: "You called Tournaments.get method" });

  Tournaments.put = (data, cb) => cb(null, { message: "You called Tournaments.put method" });

  Tournaments.post = (data, cb) => cb(null, { message: "You called Tournaments.post method" });

  Tournaments.cancel = (data, cb) => cb(null, { message: "You called Tournaments.cancel method" });

  Tournaments.reactivate = (data, cb) =>
    cb(null, { message: "You called Tournaments.reactivate method" });

  Tournaments.createInvite = (data, cb) =>
    cb(null, { message: "You called Tournaments.createInvite method" });
});

module.exports = Service;
