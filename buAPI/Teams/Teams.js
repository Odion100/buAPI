const { App } = require("sht-tasks");
const teamsModel = require("./teams.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("Teams", function() {
  const Teams = this;

  Teams.add = (data, cb) => {
    new teamsModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then(newTeam =>
        cb(null, { newTeam, status: 200, message: "New team created successfully." })
      )
      .catch(error => cb({ error, status: 400, message: "Failed to create new team" }));
  };

  Teams.get = (data, cb) => cb(null, { message: "You called Teams.get method" });

  Teams.updateFields = (data, cb) => cb(null, { message: "You called Teams.update method" });

  Teams.updateStatus = (data, cb) => cb(null, { message: "You called Teams.cancel method" });

  Teams.createInvite = (data, cb) => cb(null, { message: "You called Teams.reactivate method" });
});

module.exports = App;
