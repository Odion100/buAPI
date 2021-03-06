const { App } = require("sht-tasks");
const tournamentsModel = require("./Tournaments.model");

App.module("tournaments_invite_processor", function () {
  const { Invites } = this.useService("Networking");
  const mod = this;
  Invites.on("invite_accepted:tournaments", async (invite) => {
    const tournament = await tournamentsModel.findById(invite.source);

    if (tournament) {
      if (tournament.status === "unpublished" || tournament.status === "published") {
        if (tournament.teams.indexOf(invite.target) === -1) tournament.teams.push(invite.target);

        tournament
          .save()
          .then((doc) => {
            mod.emit("team_added", { team_id: invite.target, tournament });
          })
          .catch((error) => console.error(error));
      }
    } else {
      console.log("tournament not found");
    }
  });
});
