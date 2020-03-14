const { Service } = require("sht-tasks");
const usersModel = require("./Users.model");
const { Types } = require("mongoose");

Service.ServerModule("Users", function() {
  const Users = this;

  Users.get = ({ id, username, first_name }, cb) => {
    usersModel.find({ $or: [{ _id }, { username, password }] });
    cb(null, { message: "You called user.get method" });
  };

  Users.add = (data, cb) => {
    const user = new usersModel({ _id: Types.ObjectId(), ...data });

    user
      .save()
      .then(newUser =>
        cb(null, { newUser, status: 200, message: "New user created successfully." })
      )
      .catch(error => cb({ error, status: 400, message: "Failed to create new user" }));
  };

  Users.put = (data, cb) => cb(null, { message: "You called user.put method" });

  Users.archive = (data, cb) => cb(null, { message: "You called user.archive method" });

  Users.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});

module.exports = Service;
