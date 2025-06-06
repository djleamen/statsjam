// src/pages/Home.jsx
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

  console.log('🎯 Render state - Teams:', teams?.length || 0, 'Loading:', loading, 'Error:', !!error);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading NHL teams...</Typography>
      </Container>
    );
  }
    
  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading teams
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
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
          NHL Teams
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          Choose your favorite team to explore players and statistics
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        px: { xs: 2, sm: 4 } 
      }}>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fit, 220px)',
            sm: 'repeat(auto-fit, 220px)',
            md: 'repeat(auto-fit, 220px)',
            lg: 'repeat(auto-fit, 220px)'
          },
          gap: 2.5,
          justifyContent: 'center',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {teams.length > 0 ? (
            teams.map((team) => (
              <Card 
                key={team.id}
                sx={{ 
                  width: '220px',
                  height: '280px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardActionArea 
                  component={Link} 
                  to={`/team/${team.id}`} 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{ 
                      backgroundColor: 'white',
                      height: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <TeamLogo team={team} size={100} showFallback={false} />
                  </Box>
                  <CardContent sx={{ 
                    height: '150px',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center'
                  }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main',
                        fontSize: '1rem',
                        lineHeight: 1.1,
                        minHeight: '2.2em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.2
                      }}
                    >
                      {team.market} {team.name}
                    </Typography>
                    <Box>
                      <Chip 
                        label={team.alias || 'NHL'}
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mb: 1.2 }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        Click to view roster and stats
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          ) : (
            <Box sx={{ 
              gridColumn: '1 / -1',
              textAlign: 'center', 
              py: 8 
            }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No teams found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Debug info: Teams array length: {teams?.length || 0}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Footer */}
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
    </Container>
  );
}

export default Home
