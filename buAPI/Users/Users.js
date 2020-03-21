const { Service } = require("sht-tasks");
const usersModel = require("./Users.model");
const { Types, isValidObjectId } = require("mongoose");

Service.ServerModule("Users", function() {
  const Users = this;

  Users.get = ({ id, email, password, status }, cb) => {
    const queries = [];
    console.log(id, isValidObjectId(id));
    if (email && password) queries.push({ email, password });
    if (id && isValidObjectId(id)) queries.push({ _id: id });

    if (queries.length === 0)
      return cb({
        message: "Invalid request options. Expecting id or email and password",
        status: 400
      });
    else queries.push({ account_status: status || "Active" });

    usersModel
      .findOne({ $and: queries })
      .then(user => {
        if (user) cb({ user, status: 200 });
        else cb(null, { message: "Users resource not found", status: 404 });
      })
      .catch(error => cb(error));
  };

  Users.add = (data, cb) => {
    console.log("Request recieved");
    const user = new usersModel({ _id: Types.ObjectId(), ...data });
    console.log(user);
    user
      .save()
      .then(newUser => {
        console.log("saved succesfully-----<<>----");
        cb(null, { newUser, status: 200, message: "New user created successfully." });
      })
      .catch(error => {
        console.log("a faild attempted womp womp");
        cb({ error, status: 400, message: "Failed to create new user" });
      });
  };

  Users.updateFields = ({ id, updatedFields }, cb) => {
    usersModel
      .findByIdAndUpdate(id, { $set: updatedFields }, { new: true })
      .then(updatedUser => cb(null, { updatedUser, status: 200 }))
      .catch(error => cb({ error }));
  };

  Users.setAccoutnStatus = async ({ id, status }, cb) => {
    if (!id || !isValidObjectId(id)) return cb({ message: "Invaild id type:", status: 400 });

    try {
      const user = await usersModel.findById(id);
      if (!user) return cb({ message: "Users resource not found", status: 404 });
      user.account_status = status;
      const results = await user.save();
      cb(null, results);
    } catch (error) {
      cb({ error });
    }
  };
});

module.exports = Service;
