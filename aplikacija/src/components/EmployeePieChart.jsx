import React from 'react';
import { Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const EmployeePieChart = ({ data }) => {
  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" style={{textAlign: 'center'}}>Porazdelitev oddelanih ur med zaposlenimi</Typography>

      <div style={{ height: '300px' }}>
        <PieChart
          series={[
            {
              data: data.map((entry) => ({
                label: entry.name,
                value: entry.total_hours,
              })),
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 5,
              startAngle: -80,
              endAngle: 360,
              cx: 150,
              cy: 150,
            },
          ]}
        />
      </div>
    </Paper>
  );
};

export default EmployeePieChart;
