const request = require("supertest");
const http = require("http");
const app = require("./index"); // Adjust the path to your app file

let server;

beforeAll(() => {
  // Start the server and return a Promise to ensure readiness
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(() => resolve());
  });
});

afterAll(() => {
  // Stop the server and return a Promise to ensure proper closure
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

describe("Test GET /api/employees", () => {
  test("should return 200 and an array", async () => {
    const response = await request(server).get("/api/employees");
    expect(response.statusCode).toBe(200); // Ensure the status code is 200
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
  });
});
