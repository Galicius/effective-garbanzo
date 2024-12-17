import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EmployeeEntryForm from "./components/EmployeeEntryForm";

describe("EmployeeEntryForm - Simple Frontend Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock window.alert
  });

  test("renders form with default empty fields", async () => {
    render(<EmployeeEntryForm />);

    expect(screen.getByLabelText(/Izberite zaposlenega/i)).toHaveValue(""); // Employee dropdown
    expect(screen.getByLabelText(/Število opravljenih ur/i)).toHaveValue(""); // Hours field
    expect(screen.getByLabelText(/Datum/i)).toHaveValue(""); // Date field
    expect(screen.getByLabelText(/Opis/i)).toHaveValue(""); // Description field
  });

  test("updates input fields correctly", async () => {
    render(<EmployeeEntryForm />);

    // Input hours worked
    fireEvent.change(screen.getByLabelText(/Število opravljenih ur/i), {
      target: { value: "5" },
    });
    expect(screen.getByLabelText(/Število opravljenih ur/i)).toHaveValue(5);

    // Input date
    fireEvent.change(screen.getByLabelText(/Datum/i), {
      target: { value: "2024-12-01" },
    });
    expect(screen.getByLabelText(/Datum/i)).toHaveValue("2024-12-01");

    // Input description
    fireEvent.change(screen.getByLabelText(/Opis/i), {
      target: { value: "Test description" },
    });
    expect(screen.getByLabelText(/Opis/i)).toHaveValue("Test description");
  });

  test("displays an error when submitting empty fields", async () => {
    render(<EmployeeEntryForm />);

    // Click submit button
    fireEvent.click(screen.getByRole("button", { name: /Pošlji/i }));

    // Check for alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error submitting data");
    });
  });

  test("submits the form with valid data", async () => {
    render(<EmployeeEntryForm />);

    // Simulate user interactions
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

    // Click submit
    fireEvent.click(screen.getByRole("button", { name: /Pošlji/i }));

    // Check for alert message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Data submitted successfully");
    });
  });

  test("dropdown displays correct employee names", async () => {
    const mockEmployees = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ];

    // Mock the axios call that fetches employees
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve(mockEmployees),
    });

    await act(async () => render(<EmployeeEntryForm />));

    fireEvent.mouseDown(screen.getByLabelText(/Izberite zaposlenega/i));

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });
});
