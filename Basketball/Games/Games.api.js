const { App } = require("sht-tasks");
const gamesModel = require("./Games.model");
const { Types } = require("mongoose");
const moment = require("moment");
const Tags = require("../../_sharedMethods/Tags.api");

App.ServerModule("Games", function () {
  const Games = this;
  Tags.apply(Games, [gamesModel]);

  Games.add = (data, cb) => {
    new gamesModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then((newGame) =>
        cb(null, { newGame, status: 200, message: "New Game created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new Game" }));
  };

  Games.get = (
    {
      id,
      team1,
      team2,
      creator,
      created_date,
      to_created_date,
      court,
      status,
      start_date,
      to_start_date,
    },
    cb
  ) => {
    const queries = [];
    if (id) queries.push({ _id: id });
    else {
      if (created_date && moment(created_date).isValid()) {
        queries.push({ created_date: { $gte: moment(created_date).toJSON() } });
        if (to_created_date)
          queries.push({ created_date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (start_date && moment(start_date).isValid()) {
        queries.push({ start_date: { $gte: moment(start_date).toJSON() } });
        if (to_start_date) queries.push({ start_date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (team1) queries.push({ team1 });
      if (team2) queries.push({ team2 });
      if (creator) queries.push({ creator });
      if (court) queries.push({ court });
      if (status) queries.push({ status });
    }

    //console.log(queries);
    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    gamesModel
      .find({ $and: queries })
      .then((games) => cb(null, { games, status: 200 }))
      .catch((error) => cb(error));
  };

  Games.updateFields = async ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options: id & fields are required options" });
    try {
      const game = await gamesModel.findById(id);
      if (!game) return cb({ status: 404, message: "Game not found" });

      if (game.status !== "unpublished")
        return cb({
          status: 403,
          message: "Game details cannot be updated once it has been published",
        });
      gamesModel
        .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
        .then((updatedGame) => cb(null, { updatedGame, status: 200 }))
        .catch((error) => cb(error));
    } catch (error) {
      cb(error);
    }
  };

  Games.cancel = async ({ id, status }, cb) => {
    try {
      const game = await gamesModel.findById(id);
      if (!game) return cb({ message: "Games resource not found", status: 404 });
      game.status = status;
      const updatedGame = await game.save();
      cb(null, { status: 200, updatedGame });
    } catch (error) {
      cb(error);
    }
  };
});
