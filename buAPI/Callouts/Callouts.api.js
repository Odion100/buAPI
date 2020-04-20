const { App } = require("sht-tasks");
const calloutsModel = require("./Callouts.model");
const { Types } = require("mongoose");
const moment = require("moment");

App.ServerModule("Callouts", function () {
  const Callouts = this;

  Callouts.add = (data, cb) => {
    new calloutsModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then((newCallout) =>
        cb(null, { newCallout, status: 200, message: "New Callout created successfully." })
      )
      .catch((error) => cb({ error, status: 400, message: "Failed to create new Callout" }));
  };

  Callouts.get = (
    {
      id,
      creator,
      created_date,
      date,
      court,
      invite_only,
      description,
      tag,
      attendee,
      invitee,
      status,
    },
    cb
  ) => {
    const queries = [];
    if (id) queries.push({ _id: id });
    else {
      if (created_date && moment(created_date).isValid()) {
        queries.push({ created_date: { $gte: moment(created_date).toJSON() } });
        if (to_created_date)
          queries.push({ created_date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (date && moment(date).isValid()) {
        queries.push({ date: { $gte: moment(date).toJSON() } });
        if (to_date) queries.push({ date: { $lte: moment(to_created_date).toJSON() } });
      }

      if (attendee) queries.push({ attendees });
      if (invitee) queries.push({ invitees });
      if (creator) queries.push({ creator });
      if (court) queries.push({ court });
      if (status) queries.push({ status });
      if (tag) queries.push({ tags: tag });
      if (invite_only) queries.push({ invite_only });
      if (description)
        queries.push({ description: { $regex: new RegExp(`\\b${description}`, "gi") } });
    }

    //console.log(queries);
    if (queries.length === 0)
      return cb(null, {
        message: "Invalid request options",
        status: 400,
      });

    calloutsModel.find({ $and: queries }).then((callouts) => cb(null, { callouts, status: 200 }));
  };

  Callouts.updateFields = ({ id, fields }, cb) => {
    if (!id || !fields)
      return cb({ status: 404, message: "Invalid options: id & fields are required options" });
    calloutsModel
      .findByIdAndUpdate(id, { $set: fields }, { new: true, useFindAndModify: false })
      .then((updatedCallout) => cb(null, { updatedCallout, status: 200 }))
      .catch((error) => cb(error));
  };

  Callouts.addInvitee = async ({ id, invitee }, cb) => {
    try {
      const callout = await calloutsModel.findById(id);
      if (!callout) return cb({ message: "Callouts resource not found", status: 404 });

      if (callout.status !== "active")
        return cb({
          message: "This callout is no longer active",
          status: 403,
        });
      callout.invitees.push(invitee);
      const updatedCallout = await callout.save();
      cb(null, { status: 200, updatedCallout });
    } catch (error) {
      cb(error);
    }
  };

  Callouts.removeInvitee = async ({ id, invitee }, cb) => {
    try {
      const callout = await calloutsModel.findById(id);
      if (!callout) return cb({ message: "Callouts resource not found", status: 404 });

      if (callout.status !== "active")
        return cb({
          message: "This callout is no longer active",
          status: 403,
        });
      const index = callout.invitees.indexOf(invitee);

      if (index === -1) return cb(null, { status: 200, updatedCallout: callout });

      callout.invitees.splice(index, 1);
      const updatedCallout = await callout.save();
      cb(null, { status: 200, updatedCallout });
    } catch (error) {
      cb(error);
    }
  };

  Callouts.addAttendee = async ({ id, attendee }, cb) => {
    try {
      const callout = await calloutsModel.findById(id);
      if (!callout) return cb({ message: "Callouts resource not found", status: 404 });

      if (callout.status !== "active")
        return cb({
          message: "Cannot add attendee to a callout that is no longer active",
          status: 403,
        });

      if (callout.invite_only) {
        const index = callout.invitees.indexOf(attendee);
        if (index === -1)
          return cb({
            message: "Callout is invite only",
            status: 403,
          });
        else callout.invitees.splice(index, 1);
      }
      const index = callout.attendees.indexOf(attendee);

      if (index > -1) return cb(null, { status: 200, updatedCallout: callout });

      callout.attendees.push(attendee);
      const updatedCallout = await callout.save();
      cb(null, { status: 200, updatedCallout });
    } catch (error) {
      cb(error);
    }
  };

  Callouts.removeAttendee = async ({ id, attendee }, cb) => {
    try {
      const callout = await calloutsModel.findById(id);
      if (!callout) return cb({ message: "Callouts resource not found", status: 404 });

      if (callout.status !== "active")
        return cb({
          message: "This callout is no longer active",
          status: 403,
        });

      const index = callout.attendees.indexOf(attendee);

      if (index === -1) return cb(null, { status: 200, updatedCallout: callout });

      callout.attendees.splice(index, 1);
      const updatedCallout = await callout.save();
      cb(null, { status: 200, updatedCallout });
    } catch (error) {
      cb(error);
    }
  };

  Callouts.cancel = async ({ id }, cb) => {
    try {
      const callout = await calloutsModel.findById(id);
      if (!callout) return cb({ message: "Callouts resource not found", status: 404 });

      if (callout.status !== "active")
        return cb({
          message: "This callout is no longer active",
          status: 403,
        });

      callout.status = "canceled";
      const updatedCallout = await callout.save();
      cb(null, { status: 200, updatedCallout });
    } catch (error) {
      cb(error);
    }
  };
});
