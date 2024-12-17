const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the COR
const bcrypt = require('bcrypt');


// Load environment variables from .env file
dotenv.config({ path: "../.env" }); // Adjust path if necessary

// Initialize Express app
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Create MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Test route to check if the server and database are connected
app.get("/api/employees", (req, res) => {
  console.log("Fetching employees from the database...");
  const query = "SELECT * FROM employees";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch employees:", err);
      return res.status(500).json({ error: "Failed to fetch employees" });
    }
    console.log("Employees fetched successfully:", results);
    res.json(results);
  });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body; // Correctly destructuring username and password
  console.log("Login attempt:", { username }); // Logging the username correctly

  // Fetch the user by username
  const query = "SELECT * FROM employees WHERE username = ?";
  db.query(query, [username], async (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
          console.warn("Invalid credentials: User not found");
          return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const user = results[0];
      console.log("Fetched user:", user);

      // Compare the entered password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
          console.log("Login successful for user:", user.username);
          return res.json({ success: true, user }); // Return the user object correctly
      } else {
          console.warn("Invalid credentials: Incorrect password");
          return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  });
});





// Get work entries for a specific employee
app.get("/api/entries", (req, res) => {
  const employeeId = req.query.employeeId; // Get employeeId from query parameters
  console.log("Fetching entries for employee ID:", employeeId);
  const query = "SELECT * FROM work_entries WHERE employee_id = ?";
  
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Failed to fetch entries:", err);
      return res.status(500).json({ error: "Failed to fetch entries" });
    }
    console.log("Fetched entries:", results);
    res.json(results); // Return the array of entries
  });
});


// Update a specific work entry by ID
app.put("/api/entries/:id", (req, res) => {
  const id = req.params.id;
  const { hoursWorked, date, description } = req.body;

  console.log(`Updating entry with ID: ${id}`, { hoursWorked, date, description });

  const query = "UPDATE work_entries SET hours_worked = ?, date = ?, description = ? WHERE id = ?";
  
  db.query(query, [hoursWorked, date, description, id], (err, result) => {
      if (err) {
          console.error("Failed to update data:", err);
          return res.status(500).json({ error: "Failed to update data" });
      }
      console.log("Data updated successfully for ID:", id);
      res.status(200).json({ message: "Data updated successfully" });
  });
});

app.get("/api/entries/month", (req, res) => {
  const { employeeId, month } = req.query;
  console.log("Fetching total hours for month:", month, "and employee ID:", employeeId);

  // Modify the query to select all employee data and the total worked hours
  let query = `
    SELECT 
      employees.*,  -- Select all columns from the employees table
      SUM(work_entries.hours_worked) AS total_hours
    FROM 
      work_entries
    LEFT JOIN 
      employees ON work_entries.employee_id = employees.id
    WHERE 
      MONTH(work_entries.date) = ?
  `;
  const queryParams = [month];

  // Check if employeeId is provided, and if so, add it to the query
  if (employeeId) {
    query += " AND employee_id = ?";
    queryParams.push(employeeId);
  }

  query += " GROUP BY work_entries.employee_id";  // Ensure the query groups by employee_id

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Failed to fetch entries:", err);
      return res.status(500).json({ error: "Failed to fetch entries" });
    }

    // If results are empty, send a message indicating no data found
    if (results.length === 0) {
      return res.status(404).json({ message: "No entries found for the given criteria" });
    }

    // The result now includes all columns from employees and total worked hours
    console.log("Results:", results);
    res.json(results);  // Send the full results with employee data and total hours
  });
});

// Get summary of employees and work entries
app.get("/api/summary", (req, res) => {
  console.log("Fetching summary data...");

  // Queries to calculate total employees, total hours worked, and average hours
  const totalEmployeesQuery = "SELECT COUNT(*) AS totalEmployees FROM employees";
  const totalHoursWorkedQuery = "SELECT SUM(hours_worked) AS totalHoursWorked FROM work_entries";
  const averageHoursPerEmployeeQuery = `
    SELECT AVG(total_hours) AS averageHours
    FROM (
      SELECT SUM(hours_worked) AS total_hours 
      FROM work_entries 
      GROUP BY employee_id
    ) AS subquery
  `;

  // Execute all queries asynchronously
  db.query(totalEmployeesQuery, (err1, totalEmployeesResult) => {
    if (err1) {
      console.error("Failed to fetch total employees:", err1);
      return res.status(500).json({ error: "Failed to fetch total employees" });
    }

    db.query(totalHoursWorkedQuery, (err2, totalHoursResult) => {
      if (err2) {
        console.error("Failed to fetch total hours worked:", err2);
        return res.status(500).json({ error: "Failed to fetch total hours worked" });
      }

      db.query(averageHoursPerEmployeeQuery, (err3, averageHoursResult) => {
        if (err3) {
          console.error("Failed to fetch average hours:", err3);
          return res.status(500).json({ error: "Failed to fetch average hours" });
        }

        // Construct the response object
        const summary = {
          totalEmployees: totalEmployeesResult[0].totalEmployees || 0,
          totalHoursWorked: totalHoursResult[0].totalHoursWorked || 0,
          averageHoursPerEmployee: parseFloat(averageHoursResult[0].averageHours || 0).toFixed(2),
        };

        console.log("Summary data fetched successfully:", summary);
        res.json(summary);
      });
    });
  });
});


app.post("/api/employees", async (req, res) => {
  const { name, email, username, password, isBoss } = req.body;

  console.log("Adding a new employee:", { name, email, username, isBoss });

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO employees (name, email, username, password, isBoss) VALUES (?, ?, ?, ?, ?)";
  const queryParams = [name, email, username, hashedPassword, isBoss || 0];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Failed to add employee:", err);
      return res.status(500).json({ error: "Failed to add employee" });
    }

    console.log("Employee added successfully:", result);
    res.status(201).json({ message: "Employee added successfully", id: result.insertId });
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing
