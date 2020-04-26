const { Service } = require("sht-tasks");

Service.ServerModule("messanger", function() {
  const messanger = this;

  messanger.getChat = (data, cb) => cb(null, { message: "You called user.get method" });

  messanger.send = (data, cb) => cb(null, { message: "You called user.put method" });

  messanger.archiveChat = (data, cb) => cb(null, { message: "You called user.archive method" });
});

module.exports = Service;
