const { Service } = require("sht-tasks");
const usersModel = require("./Users.model");
const { Types, isValidObjectId } = require("mongoose");
Service.ServerModule("Users", function() {
  const Users = this;

  Users.get = ({ id, email, password }, cb) => {
    const queries = [];
    console.log(id, isValidObjectId(id));
    if (email && password) queries.push({ email, password });
    if (isValidObjectId(id)) queries.push({ _id: id });

    if (queries.length === 0)
      cb(null, { message: "Users resource not found item found", status: 404 });

    console.log("queries:", queries);
    usersModel
      .findOne({ $and: queries })
      .then(user => {
        cb(null, { user, status: 200 });
      })
      .catch(error => {
        cb(error);
      });
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
