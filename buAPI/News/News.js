const { Service } = require("sht-tasks");

Service.ServerModule("news", function() {
  const news = this;

  news.get = (data, cb) => cb(null, { message: "You called user.get method" });

  news.put = (data, cb) => cb(null, { message: "You called user.put method" });

  news.archive = (data, cb) => cb(null, { message: "You called user.archive method" });

  news.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});

module.exports = Service;
