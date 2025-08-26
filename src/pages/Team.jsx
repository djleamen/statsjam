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
  Paper,
  TableHead,
  TableContainer,
  Alert,
  Button,
} from '@mui/material'
import { ArrowBack, TrendingUp, Group, Star, EmojiEvents } from '@mui/icons-material'
import TeamLogo from '../components/TeamLogo'
import PlayerAvatar from '../components/PlayerAvatar'
import Footer from '../components/Footer'
import '../styles/Team.css'

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

  // Sort roster by points (high to low)
  const sortedRoster = roster.slice().sort((a, b) => {
    const pointsA = a.statistics?.total?.points || 0;
    const pointsB = b.statistics?.total?.points || 0;
    return pointsB - pointsA;
  });

  return (
    <Container maxWidth="xl" className="team-container">
      {/* Static Back Button */}
      <Box className="team-back-button">
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />} 
          variant="contained"
          size="medium"
        >
          Back to Teams
        </Button>
      </Box>

      {/* Hero Section with Team Header */}
      <Paper elevation={0} className="team-hero">
        <Box className="team-hero-content">
          <Box className="team-logo-container">
            <TeamLogo team={team} size={100} showFallback={true} />
          </Box>
          <Box flex={1}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              className="team-title"
              sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
            >
              {team.market} {team.name}
            </Typography>
            <Box className="team-chips">
              {team.conference && (
                <Chip 
                  label={team.conference.name} 
                  className="team-chip"
                /> 
              )}
              {team.division && (
                <Chip 
                  label={team.division.name} 
                  className="team-chip"
                />
              )}
              {team.alias && (
                <Chip 
                  label={team.alias} 
                  className="team-chip"
                />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Team Statistics Section */}
      {stats ? (
        <Paper elevation={0} className="team-section">
          <Box className="team-section-header">
            <Box className="team-section-icon">
              <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" className="team-section-title">
              Season Statistics
            </Typography>
          </Box>
          
          {/* Enhanced Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Card className="team-stat-card primary">
                <CardContent className="team-stat-card-content">
                  <EmojiEvents className="team-stat-icon" />
                  <Typography variant="body2" className="team-stat-label">
                    Games Played
                  </Typography>
                  <Typography variant="h3" className="team-stat-value">
                    {stats.own_record?.statistics?.total?.games_played || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card className="team-stat-card success">
                <CardContent className="team-stat-card-content">
                  <Star className="team-stat-icon" />
                  <Typography variant="body2" className="team-stat-label">
                    Wins
                  </Typography>
                  <Typography variant="h3" className="team-stat-value">
                    {stats.own_record?.goaltending?.total?.wins || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card className="team-stat-card error">
                <CardContent className="team-stat-card-content">
                  <Typography variant="h4" className="team-stat-icon">📉</Typography>
                  <Typography variant="body2" className="team-stat-label">
                    Losses
                  </Typography>
                  <Typography variant="h3" className="team-stat-value">
                    {stats.own_record?.goaltending?.total?.losses || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card className="team-stat-card warning">
                <CardContent className="team-stat-card-content">
                  <Typography variant="h4" className="team-stat-icon">⏱️</Typography>
                  <Typography variant="body2" className="team-stat-label">
                    OT Losses
                  </Typography>
                  <Typography variant="h3" className="team-stat-value">
                    {stats.own_record?.goaltending?.total?.overtime_losses || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Enhanced Statistics Table with More Stats */}
          <Paper elevation={2} className="team-enhanced-table">
            <TableContainer>
              <Table>
                <TableHead className="team-table-header">
                  <TableRow>
                    <TableCell>Offensive Stats</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Defensive Stats</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="team-table-row">
                    <TableCell className="team-table-cell-bold" sx={{ color: 'success.main' }}>Goals For</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.goals || 'N/A'}
                    </TableCell>
                    <TableCell className="team-table-cell-bold" sx={{ color: 'error.main' }}>Goals Against</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.goaltending?.total?.goals_against || 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow className="team-table-row">
                    <TableCell className="team-table-cell-bold">Shots For</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.shots || 'N/A'}
                    </TableCell>
                    <TableCell className="team-table-cell-bold">Save %</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.goaltending?.total?.save_pct ? `${stats.own_record.goaltending.total.save_pct}%` : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow className="team-table-row">
                    <TableCell className="team-table-cell-bold">Power Play %</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.power_play_pct ? `${stats.own_record.statistics.total.power_play_pct}%` : 'N/A'}
                    </TableCell>
                    <TableCell className="team-table-cell-bold">Penalty Kill %</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.penalty_kill_pct ? `${stats.own_record.statistics.total.penalty_kill_pct}%` : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow className="team-table-row">
                    <TableCell className="team-table-cell-bold">Faceoff Win %</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.faceoff_win_pct ? `${stats.own_record.statistics.total.faceoff_win_pct}%` : 'N/A'}
                    </TableCell>
                    <TableCell className="team-table-cell-bold">Penalty Minutes</TableCell>
                    <TableCell className="team-table-cell-value">
                      {stats.own_record?.statistics?.total?.penalty_minutes || 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Paper>
      ) : (
        <Paper elevation={0} className="team-section">
          <Box className="team-section-header">
            <Box className="team-section-icon warning">
              <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" className="team-section-title">
              Season Statistics
            </Typography>
          </Box>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 3,
              '& .MuiAlert-message': { fontSize: '1rem' }
            }}
          >
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
              Team statistics are currently unavailable
            </Typography>
            <Typography variant="body2">
              This may be due to:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>API limitations with the trial version</li>
              <li>Current season data not yet available</li>
              <li>Playoff period restrictions</li>
            </Box>
          </Alert>
        </Paper>
      )}

      {/* Team Roster Section */}
      <Paper elevation={0} className="team-section">
        <Box className="team-section-header">
          <Box className="team-section-icon secondary">
            <Group sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" className="team-section-title">
            Team Roster
          </Typography>
          <Chip 
            label={`${roster.length} players`}
            sx={{ 
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          />
        </Box>
        
        {roster.length > 0 ? (
          <Grid container spacing={3}>
            {sortedRoster.map((player) => (
              <Grid item xs={12} sm={6} lg={4} key={player.id}>
                <Card className="team-roster-card">
                  <CardActionArea 
                    component={Link} 
                    to={`/player/${player.id}`}
                    disableRipple
                    sx={{
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    <CardContent className="team-roster-content">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box className="team-player-avatar">
                          <PlayerAvatar player={{ ...player, team: team }} size={60} />
                        </Box>
                        <Box flex={1}>
                          <Typography 
                            variant="h6" 
                            className="team-player-name"
                          >
                            {player.full_name || `${player.first_name} ${player.last_name}`}
                          </Typography>
                          <Box className="team-player-chips">
                            {player.primary_position && (
                              <Chip 
                                label={player.primary_position} 
                                size="small" 
                                className="team-player-chip-primary"
                              />
                            )}
                            {player.jersey_number && (
                              <Chip 
                                label={`#${player.jersey_number}`} 
                                size="small" 
                                className="team-player-chip-secondary"
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
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 3,
              '& .MuiAlert-message': { fontSize: '1rem' }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              No roster information available
            </Typography>
          </Alert>
        )}
      </Paper>
      
      <Footer />
    </Container>
  )
}

export default Team
