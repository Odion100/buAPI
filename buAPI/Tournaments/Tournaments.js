const { Service } = require("sht-tasks");
const tournamentsModel = require("./Tournaments.model");
const { Types, isValidObjectId } = require("mongoose");
const moment = require("moment");

Service.ServerModule("Tournaments", function() {
  const Tournaments = this;

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
      description
    },
    cb
  ) => {
    const queries = [];

    if (id && isValidObjectId(id)) queries.push({ _id: id });
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
      cb(null, {
        message: "Invalid request options",
        status: 400
      });

    if (status && status !== "all") queries.push({ status });
    //console.log(queries);
    tournamentsModel
      .find({ $and: queries })
      .then(tournaments => {
        if (tournaments) cb(null, { tournaments, status: 200 });
        else cb(null, { message: "tournaments resource not found", status: 404 });
      })
      .catch(error => cb({ error }));
  };

  Tournaments.add = (data, cb) => {
    const tournament = new tournamentsModel({ _id: Types.ObjectId(), ...data });
    tournament
      .save()
      .then(newTournament =>
        cb(null, { newTournament, status: 200, message: "New tournament created successfully." })
      )
      .catch(error => cb({ error, status: 400, message: "Failed to create new tournament" }));
  };

  Tournaments.updateFields = async ({ id, updatedFields }, cb) => {
    const tournament = await tournamentsModel.findById(id);
    if (tournament.status === "in progress")
      return cb({
        message: "Cannot update tournament while tournament is in progress",
        status: 403
      });
    tournamentsModel
      .findByIdAndUpdate(id, { $set: updatedFields }, { new: true })
      .then(updatedTournament => cb(null, { updatedTournament, status: 200 }))
      .catch(error => cb({ error }));
  };

  Tournaments.cancel = (data, cb) => cb(null, { message: "You called Tournaments.cancel method" });

  Tournaments.reactivate = (data, cb) =>
    cb(null, { message: "You called Tournaments.reactivate method" });

  Tournaments.createInvite = (data, cb) =>
    cb(null, { message: "You called Tournaments.createInvite method" });

  Tournaments.publish = (data, cb) =>
    cb(null, { message: "You called Tournaments.publish method" });
});

module.exports = Service;
