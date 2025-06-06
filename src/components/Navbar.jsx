// src/components/Navbar.jsx
import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { SportsHockey } from '@mui/icons-material'

function Navbar() {
  return (
    <AppBar 
      position="fixed" 
      elevation={4}
      sx={{ 
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ maxWidth: 'none', px: 3 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <div
              style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              <img 
                src="/logo.png" 
                alt="StatsJam Logo" 
                style={{ 
                  height: '100px',
                  marginTop: '-13px',
                  marginBottom: '-15px',
                  objectFit: 'contain'
                }} 
              />
            </div>
          </Box>
        </Box>
        <Button 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ 
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(158, 158, 158, 0.2)',
              color: '#9e9e9e'
            }
          }}
        >
          NHL Teams
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/about"
          sx={{ 
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(158, 158, 158, 0.2)',
              color: '#9e9e9e'
            }
          }}
        >
          About
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
