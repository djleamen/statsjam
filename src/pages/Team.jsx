// src/pages/Team.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTeam, getTeamStats, getTeamRoster } from '../api/nhl'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Chip,
  Avatar,
  Paper,
  TableHead,
  TableContainer,
  Alert,
  Button
} from '@mui/material'
import { ArrowBack, Person, Sports } from '@mui/icons-material'
import TeamLogo from '../components/TeamLogo'
import PlayerAvatar from '../components/PlayerAvatar'

function Team() {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)
  const [stats, setStats] = useState(null)
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Fetch team profile first
        const teamData = await getTeam(teamId);
        setTeam(teamData);
        
        // Try to fetch additional data, but don't fail the whole page if rate limited
        try {
          const rosterData = await getTeamRoster(teamId);
          setRoster(rosterData || []);
        } catch (rosterError) {
          console.warn('Could not fetch roster:', rosterError.message);
          setRoster([]);
        }
        
        try {
          const statsData = await getTeamStats(teamId);
          setStats(statsData);
        } catch (statsError) {
          console.warn('Could not fetch stats:', statsError.message);
          setStats(null);
        }
        
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId])

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading team information...</Typography>
      </Container>
    )

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading team data: {error.message}
        </Alert>
        <Button component={Link} to="/" startIcon={<ArrowBack />}>
          Back to Teams
        </Button>
      </Container>
    )

  if (!team)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Team not found</Alert>
        <Button component={Link} to="/" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Teams
        </Button>
      </Container>
    )

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ position: 'absolute', top: 80, left: 16, zIndex: 1000 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />} 
          variant="outlined"
          size="small"
          sx={{ 
            bgcolor: 'white', 
            '&:hover': { bgcolor: 'grey.50' },
            fontWeight: 'medium'
          }}
        >
          Back to Teams
        </Button>
      </Box>

      {/* Team Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <TeamLogo team={team} size={80} showFallback={true} />
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              {team.market} {team.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {team.conference && (
                <Chip label={team.conference.name} color="primary" />
              )}
              {team.division && (
                <Chip label={team.division.name} color="secondary" />
              )}
              {team.alias && (
                <Chip label={team.alias} variant="outlined" />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Team Stats */}
      {stats ? (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Season Statistics
          </Typography>
          
          {/* Main Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                borderRadius: 2, 
                color: 'white', 
                textAlign: 'center',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Games Played</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.own_record?.statistics?.total?.games_played || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'success.main', 
                borderRadius: 2, 
                color: 'white', 
                textAlign: 'center',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Wins</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.own_record?.goaltending?.total?.wins || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'error.main', 
                borderRadius: 2, 
                color: 'white', 
                textAlign: 'center',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Losses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.own_record?.goaltending?.total?.losses || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'warning.main', 
                borderRadius: 2, 
                color: 'white', 
                textAlign: 'center',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>OT Losses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stats.own_record?.goaltending?.total?.overtime_losses || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Additional Statistics Table */}
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Goals For</TableCell>
                  <TableCell>
                    {stats.own_record?.statistics?.total?.goals || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Goals Against</TableCell>
                  <TableCell>
                    {stats.own_record?.goaltending?.total?.goals_against || 'N/A'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Season Statistics
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              Team statistics are currently unavailable. This may be due to:
            </Typography>
            <ul style={{ marginTop: '8px', marginBottom: '0' }}>
              <li>API limitations with the trial version</li>
              <li>Current season data not yet available</li>
              <li>Playoff period restrictions</li>
            </ul>
          </Alert>
        </Paper>
      )}

      {/* Team Roster */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Team Roster ({roster.length} players)
        </Typography>
        {roster.length > 0 ? (
          <Grid container spacing={2}>
                {roster.map((player) => (
                  <Grid item xs={12} sm={6} key={player.id}>
                    <Card 
                      sx={{ 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        }
                      }}
                    >
                      <CardActionArea component={Link} to={`/player/${player.id}`}>
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <PlayerAvatar player={{ ...player, team: team }} size={50} />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {player.full_name || `${player.first_name} ${player.last_name}`}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {player.primary_position && (
                                  <Chip 
                                    label={player.primary_position} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                )}
                                {player.jersey_number && (
                                  <Chip 
                                    label={`#${player.jersey_number}`} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
        ) : (
          <Alert severity="info">No roster information available</Alert>
        )}
      </Paper>
    </Container>
  )
}

export default Team
