// src/components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 8, 
        py: 4, 
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        StatsJam - Your Ultimate NHL Statistics Hub
      </Typography>
      <Typography variant="body2" color="textSecondary">
        © 2025 StatsJam. Data provided by SportRadar API.
      </Typography>
    </Box>
  );
};

export default Footer;
