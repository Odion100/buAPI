const { Service } = require("sht-tasks");

Service.ServerModule("stats", function () {
  const stats = this;

  //ok so there's one addStats method but the stats db is broken down into there objects:
  //GameStates, PlayerStats, Team Stats
  /*When a user addes a stat: 
    1. theres only one method to add a state: addStat
    2. the stat will identify the user, game, stat, change, date, team, 
  */
  stats.startGame = (game, cb) => {};

  stats.addStat = (stat, cb) => {
    //add player stats - someone scored
    //update stats for the game in which he scored
    //update the stats for Teams
  };
  stats.endGame = (data, cb) => cb(null, { message: "You called user.get method" });

  stats.get = (data, cb) => cb(null, { message: "You called user.post method" });
  stats.fix = (id, fix) => {};
});

module.exports = Service;
