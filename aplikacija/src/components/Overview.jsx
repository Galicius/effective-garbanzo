import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, TextField, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmployeePieChart from './EmployeePieChart';
import EmployeeDetailsDialog from './EmployeeDetailsDialog';
import { usePDF } from 'react-to-pdf';
import DownloadIcon from '@mui/icons-material/Download';

const Overview = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [employeeHours, setEmployeeHours] = useState([]);
  const [filteredEmployeeHours, setFilteredEmployeeHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { toPDF, targetRef } = usePDF({ filename: 'employee_hours.pdf' });

  useEffect(() => {
    if (selectedMonth) {
      const fetchTotalHours = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/entries/month?month=${selectedMonth}`
          );
          setEmployeeHours(response.data);
          setFilteredEmployeeHours(response.data);
          setError('');
        } catch (err) {
          setError('Napaka pri iskanju ur za ta mesec');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTotalHours();
    }
  }, [selectedMonth]);

  useEffect(() => {
    const filtered = employeeHours.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployeeHours(filtered);
  }, [searchTerm, employeeHours]);

  const handleDetailsClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '30px', paddingBottom: '20px' }}>
      <Typography variant="h4" style={{ marginBottom: '30px' }}>
        Pregled oddelanih ur
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id="month-label">Mesec</InputLabel>
                <Select
                  labelId="month-label"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Mesec"
                >
                  <MenuItem value="">-- Izberite mesec --</MenuItem>
                  {[...Array(12).keys()].map((i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={5}>
              <TextField
                variant="outlined"
                fullWidth
                style={{ marginBottom: '20px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={2} >
            <Button variant="contained" color="primary" onClick={toPDF} style={{height: '55px'}}>
                <DownloadIcon />
            </Button>
            </Grid>
          </Grid>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Pregled ur za mesec {selectedMonth && new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}:
          </Typography>

          <TableContainer component={Paper} style={{ marginTop: '20px' }} ref={targetRef}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Ime zaposlenega</strong></TableCell>
                  <TableCell><strong>Skupno število oddelanih ur</strong></TableCell>
                  <TableCell><strong>Podrobnosti</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployeeHours.length > 0 ? (
                  filteredEmployeeHours.map((entry) => (
                    <TableRow key={entry.employee_id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.total_hours}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleDetailsClick(entry)}>
                          Podrobnosti
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : selectedMonth && !loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Ni podatkov na voljo
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Izberite mesec
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={5}>
          <EmployeePieChart data={filteredEmployeeHours} />
        </Grid>
      </Grid>

     

      <EmployeeDetailsDialog
        open={openModal}
        onClose={handleCloseModal}
        employee={selectedEmployee}
      />
    </Container>
  );
};

export default Overview;
