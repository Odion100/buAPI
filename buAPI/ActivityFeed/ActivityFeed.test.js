const { expect } = require("chai");
const { Client } = require("sht-tasks");
const startService = require("./ActivityFeed");

beforeAll(() => startService());
describe("buAPI.Users", () => {
  it("should be sucessfully loaded by a Client", async () => {
    const buAPI = await Client.loadService("http://localhost:4400/bu/api");
    console.log(buAPI);
  });
});
