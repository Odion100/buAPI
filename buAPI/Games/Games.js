const { Service } = require("sht-tasks");

Service.ServerModule("Broadcasts", function() {
  const Broadcasts = this;

  Broadcasts.get = (data, cb) => cb(null, { message: "You called Broadcasts.get method" });

  Broadcasts.put = (data, cb) => cb(null, { message: "You called Broadcasts.put method" });

  Broadcasts.post = (data, cb) => cb(null, { message: "You called Broadcasts.post method" });

  Broadcasts.cancel = (data, cb) => cb(null, { message: "You called Broadcasts.cancel method" });

  Broadcasts.update = (data, cb) =>
    cb(null, { message: "You called Broadcasts.reactivate method" });

  Broadcasts.createInvite = (data, cb) =>
    cb(null, { message: "You called Broadcasts.createInvite method" });
});

module.exports = Service;
