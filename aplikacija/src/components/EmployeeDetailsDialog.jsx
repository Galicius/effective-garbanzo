import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';

const EmployeeDetailsDialog = ({ open, onClose, employee }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Podrobnosti zaposlenega</DialogTitle>
      <DialogContent style={{ padding: '30px' }}>
        {employee && (
          <div>
            <Typography variant="body1">
              <span style={{ fontWeight: 'bold' }}>Ime: </span>{employee.name}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 'bold' }}>ID zaposlenega: </span>{employee.id}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 'bold' }}>Email: </span>{employee.email}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 'bold' }}>Št. oddelanih ur: </span>{employee.total_hours}<span> / 160.00</span>
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Gauge
                width={200} 
                height={200}
                value={employee.total_hours}
                startAngle={-110}
                endAngle={110}
                valueMax={160}
                
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Zapri
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
