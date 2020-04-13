const { App } = require("sht-tasks");
const gamesModel = require("./teams.model");
const { Types } = require("mongoose");
const moment = require("moment");

Service.ServerModule("Games", function () {
  const Games = this;

  Games.add = (data, cb) => {
    new gamesModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then((newGame) =>
        cb(null, { newGame, status: 200, message: "New Game created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new Game" }));
  };

  Games.get = (data, cb) => cb(null, { message: "You called Games.get method" });

  Games.updateFields = (data, cb) => cb(null, { message: "You called Games.put method" });

  Games.updateStatus = (data, cb) => cb(null, { message: "You called Games.post method" });
});

module.exports = Service;
