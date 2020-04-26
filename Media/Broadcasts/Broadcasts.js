const { Service } = require("./node_modules/sht-tasks");

Service.ServerModule("Games", function () {
  const Games = this;

  Games.get = (data, cb) => cb(null, { message: "You called Games.get method" });

  Games.put = (data, cb) => cb(null, { message: "You called Games.put method" });

  Games.post = (data, cb) => cb(null, { message: "You called Games.post method" });

  Games.cancel = (data, cb) => cb(null, { message: "You called Games.cancel method" });

  Games.reactivate = (data, cb) => cb(null, { message: "You called Games.reactivate method" });

  Games.createInvite = (data, cb) => cb(null, { message: "You called Games.createInvite method" });
});

module.exports = Service;
