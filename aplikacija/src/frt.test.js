import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "./App";
import EmployeeEntryForm from "./components/EmployeeEntryForm";
import Overview from "./components/Overview";
import axios from "axios";

// Mock Axios
jest.mock("axios");

// Mock child components
jest.mock("./components/EmployeePieChart", () => () => <div>EmployeePieChart</div>);
jest.mock("./components/EmployeeDetailsDialog", () => ({ open }) =>
  open ? <div>EmployeeDetailsDialog</div> : null
);

// Mock `window.alert`
window.alert = jest.fn();

describe("App and Component Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("App Component", () => {
    test("renders Header when not on login view", async () => {
      render(<App />);

      // Simulate login
      const loginButton = screen.getByRole("button", { name: /Login/i });
      fireEvent.click(loginButton);

      // Wait for Header to appear
      expect(
        await screen.findByRole("heading", { name: /Evidenca ur/i })
      ).toBeInTheDocument();
    });

    test("navigates to the correct view when Header buttons are clicked", async () => {
      render(<App />);

      // Simulate login
      const loginButton = screen.getByRole("button", { name: /Login/i });
      fireEvent.click(loginButton);

      // Wait for Header to appear
      expect(
        await screen.findByRole("heading", { name: /Evidenca ur/i })
      ).toBeInTheDocument();

      // Simulate clicking "Vnesi ure" button
      const vnesiUreButton = screen.getByRole("button", { name: /Vnesi ure/i });
      fireEvent.click(vnesiUreButton);

      // Wait for Employee Entry Form content
      expect(
        await screen.findByText(/Vnos podatkov o zaposlenih/i)
      ).toBeInTheDocument();
    });
  });

  describe("Overview Component", () => {
    beforeEach(() => {
      axios.get.mockImplementation((url) => {
        if (url.includes("/api/entries/month")) {
          return Promise.resolve({
            data: [
              { employee_id: 1, name: "John Doe", total_hours: 40 },
              { employee_id: 2, name: "Jane Smith", total_hours: 35 },
            ],
          });
        }
        return Promise.reject(new Error("Not Found"));
      });
    });

    test("renders the component with initial state", () => {
      render(<Overview />);

      expect(screen.getByText(/Pregled oddelanih ur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mesec/i)).toBeInTheDocument();
      expect(screen.getByText(/Izberite mesec/i)).toBeInTheDocument();
    });

    test("fetches and displays employee hours for November", async () => {
      render(<Overview />);

      fireEvent.mouseDown(screen.getByLabelText(/Mesec/i));
      fireEvent.click(screen.getByText(/November/i));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining("/api/entries/month?month=11")
        );
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      });
    });

    test("filters employees based on search input", async () => {
      render(<Overview />);

      fireEvent.mouseDown(screen.getByLabelText(/Mesec/i));
      fireEvent.click(screen.getByText(/November/i));

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Jane" } });

      await waitFor(() => {
        expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      });
    });

    test("shows error message on data fetch failure", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));

      render(<Overview />);

      fireEvent.mouseDown(screen.getByLabelText(/Mesec/i));
      fireEvent.click(screen.getByText(/November/i));

      await waitFor(() => {
        expect(screen.getByText(/Napaka pri iskanju ur za ta mesec/i)).toBeInTheDocument();
      });
    });
  });

  describe("EmployeeEntryForm Component", () => {
    beforeEach(() => {
      axios.get.mockResolvedValueOnce({
        data: [
          { id: 1, name: "John Doe" },
          { id: 2, name: "Jane Smith" },
        ],
      });
    });

    test("renders the form with all input fields", async () => {
      await act(async () => render(<EmployeeEntryForm />));

      expect(screen.getByLabelText(/Izberite zaposlenega/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Število opravljenih ur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Datum/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Opis/i)).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByLabelText(/Izberite zaposlenega/i));

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      });
    });

    test("renders the form heading", () => {
      render(<EmployeeEntryForm />);
      expect(screen.getByText(/Vnos podatkov o zaposlenih/i)).toBeInTheDocument();
    });
  

    test("submits the form successfully", async () => {
      axios.post.mockResolvedValueOnce({ status: 200 });

      await act(async () => render(<EmployeeEntryForm />));

      fireEvent.mouseDown(screen.getByLabelText(/Izberite zaposlenega/i));
      fireEvent.click(screen.getByText(/John Doe/i));
      fireEvent.change(screen.getByLabelText(/Število opravljenih ur/i), {
        target: { value: "8" },
      });
      fireEvent.change(screen.getByLabelText(/Datum/i), {
        target: { value: "2024-12-01" },
      });
      fireEvent.change(screen.getByLabelText(/Opis/i), {
        target: { value: "Worked on project A" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Pošlji/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:5000/api/entries",
          {
            employeeId: 1,
            hoursWorked: "8",
            date: "2024-12-01",
            description: "Worked on project A",
          }
        );
      });

      expect(window.alert).toHaveBeenCalledWith("Data submitted successfully");
    });

    test("shows error on form submission failure", async () => {
      axios.post.mockRejectedValueOnce(new Error("Submission failed"));

      await act(async () => render(<EmployeeEntryForm />));

      fireEvent.mouseDown(screen.getByLabelText(/Izberite zaposlenega/i));
      fireEvent.click(screen.getByText(/John Doe/i));
      fireEvent.change(screen.getByLabelText(/Število opravljenih ur/i), {
        target: { value: "8" },
      });
      fireEvent.change(screen.getByLabelText(/Datum/i), {
        target: { value: "2024-12-01" },
      });
      fireEvent.change(screen.getByLabelText(/Opis/i), {
        target: { value: "Worked on project A" },
      });

      fireEvent.click(screen.getByRole("button", { name: /Pošlji/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Error submitting data");
      });
    });
  });
});
