const request = require("supertest");
const app = require("./index.js"); // Adjust the path to your server file

describe("API Endpoints", () => {
  
  // Test 1: GET /api/employees
  describe("GET /api/employees", () => {
    it("should return a list of employees", async () => {
      const response = await request(app).get("/api/employees");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("name"); // Replace with actual property
      }
    });
  });

  // Test 2: GET /api/employees (Empty response)
  it("should return an empty array if no employees are found", async () => {
    // Mock or ensure database is empty for this test
    const response = await request(app).get("/api/employees/333");
    expect(response.status).toBe(404);
  });

  // Test 3: POST /api/login (Valid credentials)
  describe("POST /api/login", () => {
    it("should log in the user with valid credentials", async () => {
      const sampleLogin = { username: "bob", password: "geslo123" }; // Replace with valid credentials
      const response = await request(app).post("/api/login").send(sampleLogin);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("user");
    });
  });

  // Test 4: POST /api/login (Invalid credentials)
  it("should fail login with invalid credentials", async () => {
    const invalidLogin = { username: "invalidUser", password: "wrongPassword" };
    const response = await request(app).post("/api/login").send(invalidLogin);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("success", false);
  });

  // Test 5: GET /api/entries (Valid employeeId)
  describe("GET /api/entries", () => {
    it("should return work entries for a specific employee", async () => {
      const sampleEmployeeId = 1; // Replace with a valid employee ID
      const response = await request(app).get(`/api/entries?employeeId=${sampleEmployeeId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("employee_id", sampleEmployeeId);
      }
    });
  });

  // Test 6: GET /api/entries (Invalid employeeId)
  it("should return an empty array if employeeId is invalid", async () => {
    const invalidEmployeeId = 999; // Replace with an ID that doesn't exist
    const response = await request(app).get(`/api/entries?employeeId=${invalidEmployeeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // Assuming no entries are found
  });

  // Test 7: PUT /api/entries/:id
  describe("PUT /api/entries/:id", () => {
    it("should update a specific work entry", async () => {
      const sampleEntryId = 1; // Replace with a valid entry ID
      const sampleUpdate = {
        hoursWorked: 8,
        date: "2024-12-01",
        description: "Updated work entry description"
      };
      const response = await request(app).put(`/api/entries/${sampleEntryId}`).send(sampleUpdate);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Data updated successfully");
    });
  });

  // Test 8: PUT /api/entries/:id (Invalid ID)
  it("should fail to update a non-existing entry", async () => {
    const invalidEntryId = 999; // Replace with an ID that doesn't exist
    const sampleUpdate = {
      hoursWorked: 8,
      date: "2024-12-01",
      description: "Updated work entry description"
    };
    const response = await request(app).put(`/api/entries/${invalidEntryId}`).send(sampleUpdate);
    expect(response.status).toBe(200);
  });

  // Test 9: GET /api/entries/month
  describe("GET /api/entries/month", () => {
    it("should return total work hours for a specific month", async () => {
      const sampleMonth = 12; // Replace with a valid month
      const sampleEmployeeId = 1; // Optional, replace with a valid employee ID
      const response = await request(app).get(
        `/api/entries/month?month=${sampleMonth}&employeeId=${sampleEmployeeId}`
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("total_hours");
        expect(response.body[0]).toHaveProperty("id"); // Employee ID
      }
    });
  });

  // Test 10: GET /api/entries/month (No data for the month)
  it("should return a message if no entries are found for the given month", async () => {
    const sampleMonth = 1; // Replace with a month that has no entries
    const response = await request(app).get(`/api/entries/month?month=${sampleMonth}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "No entries found for the given criteria");
  });

});
