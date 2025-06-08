// src/pages/About.jsx
import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Link as MuiLink
} from '@mui/material'
import { SportsHockey, Code, Analytics, Speed } from '@mui/icons-material'
import Footer from '../components/Footer'

function About() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          About StatsJam
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Your ultimate destination for NHL statistics and team information
        </Typography>
      </Box>

      {/* Main Content */}
      {/* What is StatsJam */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <SportsHockey color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            What is StatsJam?
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          StatsJam is a modern, responsive web application designed to provide fellow NHL fans 
          with comprehensive team and player statistics in an intuitive interface.
            Whether you're a die-hard fan or just curious about the latest stats, StatsJam has you covered.
        </Typography>
        <Typography variant="body1" paragraph>
          Browse all 32 NHL teams, explore detailed player rosters, and dive deep into 
          season statistics with our clean, user-friendly design.
        </Typography>
      </Paper>

      {/* Features */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Analytics color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Features
          </Typography>
        </Box>
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Complete NHL team directory with official logos and team statistics
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Detailed player profiles with photos and comprehensive statistics
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            NHL playoff bracket viewer with tournament series tracking
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Team roster management with player navigation
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Separate regular season and playoff statistics
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Position-specific stats display (goalies vs. skaters)
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Advanced player metrics and performance analytics
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Responsive design for desktop and mobile devices
          </Typography>
          <Typography component="li" variant="body1">
            Fast, modern interface built with React and Material-UI
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4}>

        {/* Technology Stack */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Code color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Built With
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Chip label="React 19" color="primary" />
              <Chip label="Material-UI" color="secondary" />
              <Chip label="Vite" variant="outlined" />
              <Chip label="JavaScript" variant="outlined" />
              <Chip label="SportRadar API" variant="outlined" />
              <Chip label="ESPN Media" variant="outlined" />
            </Box>
            <Typography variant="body1" paragraph>
              StatsJam leverages modern web technologies to deliver a fast, reliable experience. 
              Built with React 19 and Material-UI for a polished interface, powered by the 
              SportRadar NHL API for accurate statistics, and enhanced with ESPN's media assets 
              for team logos and player photos.
            </Typography>
          </Paper>
        </Grid>

        {/* Data Sources */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Speed color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Data Sources
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              All NHL statistics are provided by the{' '}
              <MuiLink 
                href="https://developer.sportradar.com/docs/read/hockey/NHL_v7" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ fontWeight: 'bold' }}
              >
                SportRadar NHL API
              </MuiLink>
              , ensuring accurate and up-to-date information. Team logos and player photos 
              are sourced from ESPN's comprehensive media library.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Note: This application uses the SportRadar trial API, which may have rate limits 
              and seasonal data restrictions. Some statistics may not be available during 
              off-season periods.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Footer />
    </Container>
  )
}

export default About
