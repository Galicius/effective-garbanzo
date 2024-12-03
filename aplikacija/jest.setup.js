import axios from "axios";
import "@testing-library/jest-dom";


jest.mock("axios");

// Mock GET request for employees
beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url === "http://localhost:5000/api/employees") {
      return Promise.resolve({
        data: [{ id: 1, name: "John Doe", hours: 40 }],
      });
    }
    return Promise.reject(new Error("Not found"));
  });

  // Mock POST for login
  axios.post.mockResolvedValue({
    data: { success: true, message: "Login successful", user: { id: 1 } },
  });
});
