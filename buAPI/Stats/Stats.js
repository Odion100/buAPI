const { Service } = require("sht-tasks");

Service.ServerModule("stats", function () {
  const stats = this;

  //ok so there's one addStats method but the stats db is broken down into there objects:
  //GameStates, PlayerStats, Team Stats
  //
  stats.get = (data, cb) => cb(null, { message: "You called user.get method" });

  stats.addStats = (data, cb) => {
    //add player stats - someone scored
    //update stats for the game in which he scored
    //update the stats for Teams
  };
  stats.post = (data, cb) => cb(null, { message: "You called user.post method" });
});

module.exports = Service;
