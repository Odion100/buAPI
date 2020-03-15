const { Service } = require("sht-tasks");
const usersModel = require("./Users.model");
const { Types, isValidObjectId } = require("mongoose");

Service.ServerModule("Users", function() {
  const Users = this;

  Users.get = ({ id, email, password, status }, cb) => {
    const queries = [];

    if (email && password) queries.push({ email, password });
    if (isValidObjectId(id)) queries.push({ _id: id });

    if (queries.length === 0)
      cb(null, {
        message: "Invalid request options. Expecting id or email and password",
        status: 400
      });
    else queries.push({ account_status: status || "Active" });
    usersModel
      .findOne({ $and: queries })
      .then(user => {
        if (user) cb(null, { user, status: 200 });
        else cb(null, { message: "Users resource not found", status: 404 });
      })
      .catch(error => cb({ error }));
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

  Users.updateFields = ({ id, updatedFields }, cb) => {
    usersModel
      .findByIdAndUpdate(id, { $set: updatedFields }, { new: true })
      .then(updatedUser => cb(null, { updatedUser, status: 200 }))
      .catch(error => cb({ error }));
  };

  Users.archive = async ({ id }, cb) => {
    try {
      const user = await usersModel.findById(id);
      if (!user) return cb({ message: "Users resource not found", status: 404 });
      user.account_status = "Archived";
      const results = await user.save();
      cb(null, results);
    } catch (error) {
      cb({ error });
    }
  };

  Users.activate = (data, cb) => cb(null, { message: "You called user.activate method" });
});

module.exports = Service;
