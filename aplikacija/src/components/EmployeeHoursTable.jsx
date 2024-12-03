import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, Grid, Button } from "@mui/material";
import axios from "axios";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { usePDF } from 'react-to-pdf';

const EmployeeHoursTable = ({ employeeId, onEdit }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/entries?employeeId=${employeeId}`);
        setEntries(response.data); // Assuming response.data is an array of entries
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (employeeId) {
      fetchEntries();
    }
  }, [employeeId]);

  const { toPDF, targetRef } = usePDF({ filename: 'employee_hours.pdf' });

  return (
    <Container maxWidth="lg" style={{ marginTop: '30px', paddingBottom: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '30px' }}>
        Moja evidenca ur
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={2} >
          <Button variant="contained" color="primary" onClick={toPDF} style={{ height: '55px' }}>
            <DownloadIcon/>
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }} ref={targetRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Datum</strong></TableCell>
              <TableCell><strong>Oddelane ure</strong></TableCell>
              <TableCell><strong>Opombe</strong></TableCell>
              <TableCell><strong>Uredi</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'dd-MM-yyyy')}</TableCell>
                <TableCell>{entry.hours_worked}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <EditIcon onClick={() => onEdit(entry)} style={{ cursor: 'pointer' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeHoursTable;
