describe("Test DB Service", () => {
  let _db = null;
  const ENV_BEFORE_TESTS = process.env.NODE_ENV;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
    _db = require("./db");
  });

  it("Checks if database is created", async () => {});

  afterAll(() => {
    process.env.NODE_ENV = ENV_BEFORE_TESTS;
  });
});
