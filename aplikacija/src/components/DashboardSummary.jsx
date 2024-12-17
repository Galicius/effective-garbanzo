import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalHoursWorked: 0,
    averageHoursPerEmployee: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/summary");
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6">Skupno število zaposlenih</Typography>
            <Typography variant="h4">{summaryData.totalEmployees}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6">Skupno število ur</Typography>
            <Typography variant="h4">{summaryData.totalHoursWorked}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6">Povprečne ure na zaposlenega</Typography>
            <Typography variant="h4">{summaryData.averageHoursPerEmployee}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardSummary;
