const { App } = require("sht-tasks");
const tournamentsModel = require("./Tournaments.model");
const { Types } = require("mongoose");
const moment = require("moment");
require("./Tournaments.background");

App.ServerModule("Tournaments", function () {
  const Tournaments = this;
  const tournament_invite_processor = this.useModule("tournaments_invite_processor");

  Tournaments.get = (
    {
      id,
      name,
      team,
      root_admin,
      secondary_admin,
      zipcode,
      start_date,
      to_start_date,
      created_date,
      to_created_date,
      refereed,
      status,
      type,
      description,
    },
    cb
  ) => {
    const queries = [];

    if (id) queries.push({ _id: id });
    else {
      if (team) queries.push({ teams: team });
      if (root_admin) queries.push({ root_admin });
      if (secondary_admin) queries.push({ secondary_admins: secondary_admin });
      if (zipcode) queries.push({ primary_zipcodes: zipcode });
      if (type) queries.push({ type });

      if (start_date && moment(start_date).isValid()) {
        queries.push({ start_date: { $gte: moment(start_date).toJSON() } });
        if (to_start_date) queries.push({ start_date: { $lte: moment(to_start_date).toJSON() } });
      }

      if (created_date && moment(created_date).isValid()) {
        queries.push({ created_date: { $gte: moment(created_date).toJSON() } });
        if (to_created_date)
          queries.push({ created_date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (description)
        queries.push({ description: { $regex: new RegExp(`\\b${description}`, "gi") } });

      if (name) queries.push({ name: { $regex: new RegExp(`\\b${name}`, "gi") } });

      if (typeof refereed === "boolean") queries.push({ refereed });
    }

    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    if (status && status !== "all") queries.push({ status });
    //console.log(queries);
    tournamentsModel
      .find({ $and: queries })
      .then((tournaments) => {
        if (tournaments) cb(null, { tournaments, status: 200 });
        else cb(null, { message: "tournaments resource not found", status: 404 });
      })
      .catch((error) => cb(error));
  };

  Tournaments.add = (data, cb) => {
    new tournamentsModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then((newTournament) =>
        cb(null, { newTournament, status: 200, message: "New tournament created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new tournament" }));
  };

  Tournaments.updateFields = async ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options:Expecting: id, fields" });
    try {
      const tournament = await tournamentsModel.findOne({ _id: id });
      if (!tournament) return cb({ status: 404, message: "Tournament not found" });

      if (tournament.status !== "unpublished")
        return cb({
          status: 403,
          message: "Tournament details cannot be updated once it has been published",
        });
      tournamentsModel
        .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
        .then((updatedTournament) => cb(null, { updatedTournament, status: 200 }));
    } catch (error) {
      cb(error);
    }
  };

  Tournaments.publish = async ({ id }, cb) => {
    try {
      const tournament = await tournamentsModel.findOne({ _id: id });
      if (!tournament) return cb({ status: 404, message: "Tournament not found" });

      if (tournament.status !== "unpublished")
        return cb({ status: 403, tournament, message: "Tournament has already been published" });
      if (!tournament.start_date || !moment(tournament.start_date).isSameOrAfter(moment(), "day"))
        return cb({
          status: 403,
          tournament,
          message: "Tournament start date be today or before, to be published",
        });
      if (!tournament.type)
        return cb({
          status: 403,
          tournament,
          message: "Tournament type must be choosen before it can be published",
        });
      tournament.status = "published";
      tournament
        .save()
        .then((updatedTournament) => cb(null, { updatedTournament, status: 200 }))
        .catch((error) => cb(error));
    } catch (error) {
      cb(error);
    }
  };

  Tournaments.cancel = ({ id }, cb) => {
    1;
    tournamentsModel
      .findOne({ _id: id })
      .then((tournament) => {
        if (!tournament) return cb({ status: 404, message: `Tournament not found for id:${id}` });

        switch (tournament.status) {
          case "published":
            tournament.status = "unpublished";
            break;
          case "in progress":
            tournament.status = "paused";
            break;
          default:
            return cb({
              status: 403,
              message:
                "A tournament cannot be canceled unless it's status is 'in progress' or 'published'",
            });
        }

        tournament
          .save()
          .then((updatedTournament) => cb(null, { updatedTournament, status: 200 }))
          .catch((error) => cb(error));
      })
      .catch((error) => cb(error));
  };

  Tournaments.reactivate = ({ id }, cb) => {
    tournamentsModel
      .findOne({ _id: id })
      .then((tournament) => {
        if (!tournament) return cb({ status: 404, message: `Tournament not found for id:${id}` });

        switch (tournament.status) {
          case "unpublished":
            tournament.status = "unpublished";
            Tournaments.publish({ id }, cb);
            break;
          case "paused":
            tournament.status = "in progress";
            tournament
              .save()
              .then((updatedTournament) => cb(null, { updatedTournament, status: 200 }))
              .catch((error) => cb(error));
            break;
          default:
            return cb({
              status: 403,
              message:
                "A tournament cannot be reactivated unless it's status is 'unpublished' or 'paused'",
            });
        }
      })
      .catch((error) => cb(error));
  };

  tournament_invite_processor.on("team_added", ({ team_id, tournament }) =>
    Tournaments.emit(`team_added:${team_id}`, tournament)
  );
});

module.exports = App;
