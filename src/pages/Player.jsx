// src/pages/Player.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlayer, getPlayerStats } from '../api/nhl'
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  Avatar,
  Paper,
  Grid,
  Chip,
  Alert,
  TableContainer
} from '@mui/material'
import { ArrowBack, Person, TrendingUp } from '@mui/icons-material'
import PlayerAvatar from '../components/PlayerAvatar'

function Player() {
  const { playerId } = useParams()
  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Fetch player profile first
        const playerData = await getPlayer(playerId);
        setPlayer(playerData);
        
        // Try to fetch player statistics
        try {
          const statsData = await getPlayerStats(playerId);
          console.log('Player stats data:', statsData);
          setStats(statsData);
        } catch (statsError) {
          console.warn('Could not fetch player stats:', statsError.message);
          setStats(null);
        }
        
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerId])

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading player information...</Typography>
      </Container>
    )

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading player data: {error.message}
        </Alert>
        <Button component={Link} to="/" startIcon={<ArrowBack />}>
          Back to Teams
        </Button>
      </Container>
    )

  if (!player)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Player not found</Alert>
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
          to={player.team ? `/team/${player.team.id}` : "/"} 
          startIcon={<ArrowBack />} 
          variant="outlined" 
          size="small"
          sx={{ 
            bgcolor: 'white', 
            '&:hover': { bgcolor: 'grey.50' },
            fontWeight: 'medium'
          }}
        >
          {player.team ? `Back to ${player.team.name}` : 'Back to Teams'}
        </Button>
      </Box>

      {/* Player Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <PlayerAvatar player={player} size={80} />
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              {player.full_name || `${player.first_name} ${player.last_name}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {player.jersey_number && (
                <Chip 
                  label={`#${player.jersey_number}`} 
                  color="primary"
                />
              )}
              {player.primary_position && (
                <Chip 
                  label={player.primary_position} 
                  color="secondary"
                />
              )}
              {player.team && (
                <Chip 
                  label={`${player.team.market} ${player.team.name}`} 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Player Info */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Person color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Player Information
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                <TableCell>
                  {player.birthdate 
                    ? new Date().getFullYear() - new Date(player.birthdate).getFullYear()
                    : 'N/A'
                  }
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Height</TableCell>
                <TableCell>
                  {player.height ? `${player.height} inches` : 'N/A'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                <TableCell>
                  {player.weight ? `${player.weight} lbs` : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Shoots</TableCell>
                <TableCell>
                  {player.handedness || 'N/A'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Birthplace</TableCell>
                <TableCell>
                  {player.birth_place || 'N/A'}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Birthdate</TableCell>
                <TableCell>
                  {player.birthdate ? new Date(player.birthdate).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Player Stats */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <TrendingUp color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Season Statistics
          </Typography>
        </Box>
        {stats ? (
          <>
            {/* Season and Team Info */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {stats.season && (
                <Chip 
                  label={`${stats.season.year} (${stats.season.type})`}
                  color="primary"
                  sx={{ fontSize: '0.9rem' }}
                />
              )}
              {stats.team && (
                <Chip 
                  label={`${stats.team.market} ${stats.team.name} (${stats.team.alias})`}
                  color="secondary"
                  sx={{ fontSize: '0.9rem' }}
                />
              )}
            </Box>
            
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Games</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.statistics?.total?.games_played || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'secondary.main', 
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Goals</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.statistics?.total?.goals || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'info.main', 
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Assists</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.statistics?.total?.assists || 'N/A'}
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Points</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.statistics?.total?.points || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Additional Statistics Table */}
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Plus/Minus</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.plus_minus !== undefined ? 
                        (stats.statistics.total.plus_minus >= 0 ? '+' : '') + stats.statistics.total.plus_minus : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Penalty Minutes</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.penalty_minutes || 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Shots</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.shots || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hits</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.hits || 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Shooting %</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.shooting_pct ? 
                        `${stats.statistics.total.shooting_pct}%` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Takeaways</TableCell>
                    <TableCell>
                      {stats.statistics?.total?.takeaways || 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Alert severity="info">
            <Typography variant="body2">
              Player statistics are currently unavailable. This may be due to:
            </Typography>
            <ul style={{ marginTop: '8px', marginBottom: '0' }}>
              <li>No regular season statistics available</li>
              <li>Player profile does not contain statistics data</li>
              <li>API limitations with the trial version</li>
            </ul>
          </Alert>
        )}
      </Paper>
    </Container>
  )
}

export default Player
