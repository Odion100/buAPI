const { Service } = require("sht-tasks");
const tournamentsModel = require("./Tournaments.model");
Service.ServerModule("Tournaments", function() {
  const Tournaments = this;

  Tournaments.get = (
    {
      id,
      name,
      team,
      root_admin,
      secondary_admin,
      zip_code,
      start_date,
      end_date,
      status,
      rules,
      description
    },
    cb
  ) => {
    const queries = [];

    if (id && isValidObjectId(id)) queries.push({ _id: id });
    else {
      if (name) queries.push({ name });
      if (team) queries.push({ teams: team });
      if (root_admin) queries.push({ root_admin });
      if (secondary_admin) queries.push({ secondary_admins: secondary_admin });
      if (zip_code) queries.push({ primary_zipcodes: zip_code });
      if (rules) queries.push({ rules });
      if (start_date && end_date) {
        //create date range query
      }
      if (description) {
        //create regex query
      }
    }

    if (queries.length === 0)
      cb(null, {
        message: "Invalid request options",
        status: 400
      });

    if (status !== "all")
      queries.push(status ? { status } : { $or: [{ status: "Active" }, { status: "Pending" }] });

    tournamentsModel
      .find({ $and: queries })
      .then(tornament => {
        if (tornament) cb(null, { tornament, status: 200 });
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

  Tournaments.cancel = (data, cb) => cb(null, { message: "You called Tournaments.cancel method" });

  Tournaments.reactivate = (data, cb) =>
    cb(null, { message: "You called Tournaments.reactivate method" });

  Tournaments.createInvite = (data, cb) =>
    cb(null, { message: "You called Tournaments.createInvite method" });

  Tournaments.addTeam = (data, cb) => {};

  Tournaments.updateFields = ({ id, updatedFields }, cb) => {
    tornamentsModel
      .findByIdAndUpdate(id, { $set: updatedFields }, { new: true })
      .then(updatedTournament => cb(null, { updatedTournament, status: 200 }))
      .catch(error => cb({ error }));
  };
});

module.exports = Service;
