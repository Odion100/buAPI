const { App } = require("sht-tasks");
const gamesModel = require("./Games.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("Games", function () {
  const Games = this;

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
      tag,
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
      if (tag) queries.push({ tags: tag });
    }

    //console.log(queries);
    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    gamesModel.find({ $and: queries }).then((games) => cb(null, { games, status: 200 }));
  };

  Games.updateFields = ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options: id & fields are required options" });
    gamesModel
      .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
      .then((updatedGame) => cb(null, { updatedGame, status: 200 }))
      .catch((error) => cb(error));
  };
});
