const { Service } = require("sht-tasks");
const invitesModel = require("./Invites.model");
const { Types } = require("mongoose");
const moment = require("moment");
Service.ServerModule("Invites", function() {
  const Invites = this;

  Invites.add = (data, cb) => {
    new invitesModel({ _id: Types.ObjectId(), ...data })
      .save()
      .then(newInvite =>
        cb(null, { newInvite, status: 200, message: "New invite created successfully." })
      )
      .catch(error => cb({ error, status: 400, message: "Failed to create new invite" }));
  };

  Invites.get = ({ id, source, target }, cb) => {
    const queries = [];
    if (id) queries.push({ _id: id });
    if (source) queries.push({ source });
    if (target) queries.push({ target });
    //console.log(queries);
    if (queries.length === 0)
      return cb({
        message: "Invalid request options. Expecting id or source and/or target",
        status: 400
      });

    invitesModel
      .find({ $and: queries }, { password: 0 })
      .then(invites => cb(null, { invites, status: 200 }))
      .catch(error => cb(error));
  };

  Invites.sendResponse = ({ id, message = "", status }, cb) => {
    if (!id) return cb({ status: 404, message: "invalid options: 'id' is required" });

    if (status !== "accepted" && status !== "rejected")
      return cb("invalid options: status must be 'accepted' or 'rejected'");
    invitesModel
      .findOne({ _id: id })
      .then(invite => {
        if (!invite) return cb({ status: 404, message: "invite not found" });
        if (invite.status !== "sent")
          return cb({ status: 403, message: "invite response already recieved", invite });

        invite.status = status;
        invite.response_message = message;
        invite.response_date = moment().toJSON();
        invite
          .save()
          .then(updatedInvite => cb(null, { updatedInvite, status: 200 }))
          .catch(error => cb(error));
      })
      .catch(error => cb(error));
  };

  Invites.cancel = ({ id }, cb) => {
    if (!id) return cb({ status: 404, message: "invalid options: 'id' is required" });
    invitesModel
      .findOne({ _id: id })
      .then(invite => {
        if (!invite) return cb({ status: 404, message: "invite not found" });
        if (invite.status !== "sent")
          return cb({
            status: 403,
            message: "invite response already recieved, or canceled",
            invite
          });

        invite.status = "canceled";
        invite
          .save()
          .then(updatedInvite => cb(null, { updatedInvite, status: 200 }))
          .catch(error => cb(error));
      })
      .catch(error => cb(error));
  };

  Invites.markAsViewed = ({ id }, cb) => {
    if (!id) return cb({ status: 404, message: "invalid options: 'id' is required" });
    invitesModel
      .findOne({ _id: id })
      .then(invite => {
        if (!invite) return cb({ status: 404, message: "invite not found" });

        invite.viewed_date = moment().toJSON();
        invite
          .save()
          .then(updatedInvite => cb(null, { updatedInvite, status: 200 }))
          .catch(error => cb(error));
      })
      .catch(error => cb(error));
  };

  Invites.resend = ({ id, message }, cb) => {
    //resend existing invites that were rejected or canceld
    if (!id) return cb({ status: 404, message: "invalid options: 'id' is required" });
    invitesModel
      .findOne({ _id: id })
      .then(invite => {
        if (!invite) return cb({ status: 404, message: "invite not found" });

        invite.viewed_date = null;
        invite.status = "sent";
        invite.invitation_message = message || invite.invitation_message;

        invite
          .save()
          .then(updatedInvite => cb(null, { updatedInvite, status: 200 }))
          .catch(error => cb(error));
      })
      .catch(error => cb(error));
  };
});
