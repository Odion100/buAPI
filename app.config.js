module.exports = {
  apps: [
    {
      script: "Networking",
      watch: true,
      wait_ready: false,
    },
    {
      script: "Basketball",
      watch: true,
      wait_ready: true,
    },
    {
      script: "GameData",
      watch: true,
      wait_ready: true,
    },
  ],
};
