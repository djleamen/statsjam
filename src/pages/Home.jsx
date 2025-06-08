import React, { useState, useEffect } from 'react'
import { getTeams } from '../api/nhl'
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Container, 
  CircularProgress,
  Box,
  Chip
} from '@mui/material'
import { Link } from 'react-router-dom'
import TeamLogo from '../components/TeamLogo'
import Footer from '../components/Footer'

// TeamCard component for displaying individual team cards
const TeamCard = ({ team }) => {
  return (
    <Card 
      sx={{
        width: '240px',
        height: '320px',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(25, 118, 210, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(25, 118, 210, 0.08)',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        '&::before': {
          display: 'none',
        },
        '&:hover::before': {
          display: 'none',
        }
      }}
    >
      <CardActionArea 
        component={Link} 
        to={`/team/${team.id}`} 
        disableRipple
        disableTouchRipple
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'transparent !important',
          '&:hover': {
            backgroundColor: 'transparent !important',
          },
          '&:focus': {
            backgroundColor: 'transparent !important',
          },
          '&:active': {
            backgroundColor: 'transparent !important',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'transparent !important',
          },
          '&:hover .team-logo': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          // Override all possible Material-UI states
          '& .MuiCardActionArea-focusHighlight': {
            display: 'none',
          },
          '& .MuiTouchRipple-root': {
            display: 'none',
          }
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: '#ffffff',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            className="team-logo"
            sx={{
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
              zIndex: 1,
              position: 'relative'
            }}
          >
            <TeamLogo team={team} size={110} showFallback={false} />
          </Box>
        </Box>
        <CardContent sx={{ 
          height: '160px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'center',
          backgroundColor: '#ffffff'
        }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.1rem',
              lineHeight: 1.2,
              minHeight: '2.4em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              letterSpacing: '0.02em'
            }}
          >
            {team.market} {team.name}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Chip 
              label={team.alias || 'NHL'}
              size="medium" 
              sx={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                border: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.2s ease'
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

function Home() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🚀 Component mounted, starting team fetch...');
    
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        console.log('✅ Teams fetched successfully:', data?.length, 'teams');
        setTeams(data || []);
      } catch (err) {
        console.error('❌ Error fetching teams:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [])

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography>Loading teams...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error loading teams: {error.message}</Typography>
      </Container>
    )
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main', mb: 4 }}>
          NHL Teams
        </Typography>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: 3 
          }}
        >
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </Box>
      </Container>
      <Footer />
    </>
  )
}

export default Home
