const { App } = require("sht-tasks");
const teamsModel = require("./Teams.model");

App.module("teams_invite_processor", function () {
  const { Invites } = this.useService("Utils");
  const mod = this;
  Invites.on("invite_accepted:teams", async (invite) => {
    const team = await teamsModel.findById(invite.source);

    if (team) {
      if (team.status === "active") {
        team.members.push(invite.target);

        team
          .save()
          .then((doc) => {
            mod.emit("team_added", { member_id: invite.target, team });
          })
          .catch((error) => console.error(error));
      }
    } else {
      console.error("team not found");
    }
  });
});
