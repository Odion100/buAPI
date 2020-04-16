const { App } = require("sht-tasks");
const calloutsModel = require("./Callouts.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("Callouts", function () {
  const Callouts = this;

  Callouts.add = (data, cb) => cb(null, { message: "Callouts.add received" });
  Callouts.get = (data, cb) => cb(null, { message: "Callouts.get received" });
  Callouts.updateFields = (data, cb) => cb(null, { message: "Callouts.updateFields received" });
  Callouts.addMatchup = (data, cb) => cb(null, { message: "Callouts.addMatchup received" });
  Callouts.addAttendee = (data, cb) => cb(null, { message: "Callouts.addAttendee received" });
  Callouts.removeAttendee = (data, cb) => cb(null, { message: "Callouts.removeAttendee received" });
  Callouts.cancel = (data, cb) => cb(null, { message: "Callouts.cancel received" });
  Callouts.reactive = (data, cb) => cb(null, { message: "Callouts.reactive received" });
});
