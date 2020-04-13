const { App } = require("sht-tasks");
const teamsModel = require("./teams.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("Teams", function () {
  const Teams = this;

  Teams.add = (data, cb) => {
    new teamsModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then((newTeam) =>
        cb(null, { newTeam, status: 200, message: "New team created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new team" }));
  };

  Teams.get = (
    {
      id,
      name,
      root_admin,
      created_date,
      to_created_date,
      secondary_admin,
      zipcode,
      status = "active",
      description,
      member,
    },
    cb
  ) => {
    const queries = [];
    if (id) queries.push({ _id: id });
    else {
      if (root_admin) queries.push({ root_admin });
      if (secondary_admin) queries.push({ secondary_admins: secondary_admin });
      if (zipcode) queries.push({ primary_zipcodes: zipcode });
      if (member) queries.push({ members: member });

      if (created_date && moment(created_date).isValid()) {
        queries.push({ created_date: { $gte: moment(created_date).toJSON() } });
        if (to_created_date)
          queries.push({ created_date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (description)
        queries.push({ description: { $regex: new RegExp(`\\b${description}`, "gi") } });

      if (name) queries.push({ name: { $regex: new RegExp(`\\b${name}`, "gi") } });
    }
    //console.log(queries);
    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    queries.push({ status });
    teamsModel.find({ $and: queries }).then((teams) => cb(null, { teams, status: 200 }));
  };

  Teams.updateFields = ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options: id & fields are required options" });
    teamsModel
      .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
      .then((updatedTeam) => cb(null, { updatedTeam, status: 200 }))
      .catch((error) => cb(error));
  };
});

module.exports = App;
