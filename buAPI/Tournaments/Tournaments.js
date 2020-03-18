const { Service } = require("sht-tasks");
const tournamentsModel = require("./Tournaments.model");
Service.ServerModule("Tournaments", function() {
  const Tournaments = this;

  Tournaments.get = (data, cb) => {
    const queries = [];

    if (isValidObjectId(id)) queries.push({ _id: id });

    if (queries.length === 0)
      cb(null, {
        message: "Invalid request options. Expecting id or email and password",
        status: 400
      });
    else queries.push({ account_status: status || "Active" });

    tournamentsModel
      .find({ $and: queries })
      .then(user => {
        if (user) cb(null, { user, status: 200 });
        else cb(null, { message: "Users resource not found", status: 404 });
      })
      .catch(error => cb({ error }));
  };

  Tournaments.put = (data, cb) => cb(null, { message: "You called Tournaments.put method" });

  Tournaments.post = (data, cb) => cb(null, { message: "You called Tournaments.post method" });

  Tournaments.cancel = (data, cb) => cb(null, { message: "You called Tournaments.cancel method" });

  Tournaments.reactivate = (data, cb) =>
    cb(null, { message: "You called Tournaments.reactivate method" });

  Tournaments.createInvite = (data, cb) =>
    cb(null, { message: "You called Tournaments.createInvite method" });
});

module.exports = Service;
