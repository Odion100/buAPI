const { Service } = require("sht-tasks");
const usersModel = require("./Users.model");
const { Types } = require("mongoose");

Service.ServerModule("Users", function() {
  const Users = this;

  Users.get = ({ id, email, password, status }, cb) => {
    const queries = [];
    if (email && password) queries.push({ email, password });
    if (id) queries.push({ _id: id });

    if (queries.length === 0)
      return cb({
        message: "Invalid request options. Expecting id or email and password",
        status: 400
      });
    else queries.push({ account_status: status || "Active" });

    usersModel
      .findOne({ $and: queries }, { password: 0 })
      .then(user => {
        if (user) cb(null, { user, status: 200 });
        else cb({ message: "Users resource not found", status: 404 });
      })
      .catch(error => cb(error));
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

  Users.update = ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options:Expecting: id, fields" });
    usersModel
      .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
      .then(updatedUser => cb(null, { updatedUser, status: 200 }))
      .catch(error => cb(error));
  };

  Users.setAccountStatus = async ({ id, status }, cb) => {
    try {
      const user = await usersModel.findById(id);
      if (!user) return cb({ message: "Users resource not found", status: 404 });
      user.account_status = status;
      const updatedUser = await user.save();
      cb(null, { status: 200, updatedUser });
    } catch (error) {
      cb(error);
    }
  };
});

module.exports = Service;
