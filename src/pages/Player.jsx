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
  Paper,
  Grid,
  Chip,
  Alert,
  TableContainer,
  TableHead,
} from '@mui/material'
import { ArrowBack, Person, TrendingUp, Sports, Star, EmojiEvents, Shield } from '@mui/icons-material'
import PlayerAvatar from '../components/PlayerAvatar'
import Footer from '../components/Footer'
import '../styles/Player.css'

function Player() {
  const { playerId } = useParams()
  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [playoffStats, setPlayoffStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Helper function to determine if player is a goalie
  const isGoalie = (player) => {
    return player?.primary_position === 'G' || player?.primary_position === 'Goalie'
  }

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Fetch player profile first
        const playerData = await getPlayer(playerId);
        setPlayer(playerData);
        
        // Try to fetch player statistics
        try {
          const statsData = await getPlayerStats(playerId, 'REG');
          console.log('Player regular season stats data:', statsData);
          setStats(statsData);
        } catch (statsError) {
          console.warn('Could not fetch player regular season stats:', statsError.message);
          setStats(null);
        }

        // Try to fetch player playoff statistics
        try {
          const playoffStatsData = await getPlayerStats(playerId, 'PST');
          console.log('Player playoff stats data:', playoffStatsData);
          setPlayoffStats(playoffStatsData);
        } catch (playoffStatsError) {
          console.warn('Could not fetch player playoff stats:', playoffStatsError.message);
          setPlayoffStats(null);
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

  // Helper render functions to reduce complexity and avoid nested ternaries
  const getPlayerAge = (birthdate) => {
    if (!birthdate) return 0;
    return new Date().getFullYear() - new Date(birthdate).getFullYear();
  };

  const getPlusMinus = (pm) => {
    if (pm === undefined) return 0;
    if (pm >= 0) return `+${pm}`;
    return pm;
  };

  const getShootingPct = (pct) => {
    if (pct) return `${pct}%`;
    return '0%';
  };

  const getSavePercentage = (goaltending) => {
    if (!goaltending) return 'N/A';
    if (goaltending.save_percentage !== undefined) return `${(goaltending.save_percentage * 100).toFixed(1)}%`;
    if (goaltending.save_pct !== undefined) return `${goaltending.save_pct}%`;
    if (goaltending.saves && goaltending.shots_against) {
      return `${((goaltending.saves / goaltending.shots_against) * 100).toFixed(1)}%`;
    }
    return 'N/A';
  };

  const renderStatCards = (isGoalieView, statsObj) => {
    if (!statsObj) return null;
    if (isGoalieView) {
      const goaltending = statsObj.goaltending?.total || {};
      return (
        <>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card goals">
              <CardContent className="player-stat-card-content">
                <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>🏆</Typography>
                <Typography variant="body2" className="player-stat-card-label">Wins</Typography>
                <Typography variant="h3" className="player-stat-card-value">{goaltending.wins || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card assists">
              <CardContent className="player-stat-card-content">
                <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>❌</Typography>
                <Typography variant="body2" className="player-stat-card-label">Losses</Typography>
                <Typography variant="h3" className="player-stat-card-value">{goaltending.losses || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card save-percentage">
              <CardContent className="player-stat-card-content">
                <Shield sx={{ fontSize: 32, mb: 1, opacity: 0.9 }} />
                <Typography variant="body2" className="player-stat-card-label">Save %</Typography>
                <Typography variant="h3" className="player-stat-card-value">{getSavePercentage(goaltending)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </>
      );
    } else {
      const skater = statsObj.statistics?.total || {};
      return (
        <>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card goals">
              <CardContent className="player-stat-card-content">
                <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>🥅</Typography>
                <Typography variant="body2" className="player-stat-card-label">Goals</Typography>
                <Typography variant="h3" className="player-stat-card-value">{skater.goals || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card assists">
              <CardContent className="player-stat-card-content">
                <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>🎯</Typography>
                <Typography variant="body2" className="player-stat-card-label">Assists</Typography>
                <Typography variant="h3" className="player-stat-card-value">{skater.assists || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card className="player-stat-card points">
              <CardContent className="player-stat-card-content">
                <Star sx={{ fontSize: 32, mb: 1, opacity: 0.9 }} />
                <Typography variant="body2" className="player-stat-card-label">Points</Typography>
                <Typography variant="h3" className="player-stat-card-value">{skater.points || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </>
      );
    }
  };

  const renderStatTableRows = (isGoalieView, statsObj) => {
    if (!statsObj) return null;
    if (isGoalieView) {
      const g = statsObj.goaltending?.total || {};
      return (
        <>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">Saves</TableCell>
            <TableCell className="player-stats-table-value">{g.saves || 0}</TableCell>
            <TableCell className="player-stats-table-cell">Goals Against</TableCell>
            <TableCell className="player-stats-table-value">{g.goals_against || 0}</TableCell>
          </TableRow>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">OT Losses</TableCell>
            <TableCell className="player-stats-table-value">{g.overtime_losses || 0}</TableCell>
            <TableCell className="player-stats-table-cell">Shutouts</TableCell>
            <TableCell className="player-stats-table-value">{g.shutouts || 0}</TableCell>
          </TableRow>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">GAA</TableCell>
            <TableCell className="player-stats-table-value">{g.avg_goals_against ? g.avg_goals_against.toFixed(2) : '0.00'}</TableCell>
            <TableCell className="player-stats-table-cell">Shots Against</TableCell>
            <TableCell className="player-stats-table-value">{g.shots_against || 0}</TableCell>
          </TableRow>
        </>
      );
    } else {
      const s = statsObj.statistics?.total || {};
      return (
        <>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">Plus/Minus</TableCell>
            <TableCell className="player-stats-table-value">{getPlusMinus(s.plus_minus)}</TableCell>
            <TableCell className="player-stats-table-cell">Penalty Minutes</TableCell>
            <TableCell className="player-stats-table-value">{s.penalty_minutes || 0}</TableCell>
          </TableRow>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">Shots</TableCell>
            <TableCell className="player-stats-table-value">{s.shots || 0}</TableCell>
            <TableCell className="player-stats-table-cell">Hits</TableCell>
            <TableCell className="player-stats-table-value">{s.hits || 0}</TableCell>
          </TableRow>
          <TableRow className="player-stats-table-row">
            <TableCell className="player-stats-table-cell">Shooting %</TableCell>
            <TableCell className="player-stats-table-value">{getShootingPct(s.shooting_pct)}</TableCell>
            <TableCell className="player-stats-table-cell">Takeaways</TableCell>
            <TableCell className="player-stats-table-value">{s.takeaways || 0}</TableCell>
          </TableRow>
        </>
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Box className="player-back-button">
        <Button 
          component={Link} 
          to={player.team ? `/team/${player.team.id}` : "/"} 
          startIcon={<ArrowBack />} 
          variant="contained"
          size="medium"
          className="back-button"
        >
          {player.team ? `Back to ${player.team.name}` : 'Back to Teams'}
        </Button>
      </Box>

      {/* Hero Section with Player Header */}
      <Paper elevation={0} className="player-hero">
        <Box display="flex" alignItems="center" gap={{ xs: 2, md: 4 }} className="player-hero-content">
          <Box className="player-hero-avatar">
            <PlayerAvatar player={player} size={100} />
          </Box>
          <Box flex={1}>
            <Typography variant="h2" component="h1" gutterBottom className="player-hero-name">
              {player.full_name || `${player.first_name} ${player.last_name}`}
            </Typography>
            <Box className="player-hero-chips">
              {player.jersey_number && (
                <Chip label={`#${player.jersey_number}`} className="player-hero-chip" />
              )}
              {player.primary_position && (
                <Chip label={player.primary_position} className="player-hero-chip" />
              )}
              {player.team && (
                <Chip label={`${player.team.market} ${player.team.name}`} className="player-hero-chip" />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Player Information Section */}
      <Paper elevation={0} className="player-info-section">
        <Box className="player-section-header">
          <Box className="player-section-icon info-icon">
            <Person sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" className="player-section-title">Player Information</Typography>
        </Box>
        <TableContainer component={Paper} elevation={2} className="player-info-table-container">
          <Table className="player-info-table">
            <TableHead className="player-info-table-header">
              <TableRow>
                <TableCell>Attribute</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Attribute</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className="player-info-table-row">
                <TableCell className="player-info-table-cell-label">Age</TableCell>
                <TableCell className="player-info-table-cell-value">{getPlayerAge(player.birthdate)}</TableCell>
                <TableCell className="player-info-table-cell-label">Birthplace</TableCell>
                <TableCell className="player-info-table-cell-value">{player.birth_place || 'N/A'}</TableCell>
              </TableRow>
              <TableRow className="player-info-table-row">
                <TableCell className="player-info-table-cell-label">Height</TableCell>
                <TableCell className="player-info-table-cell-value">{player.height ? `${player.height}"` : '0"'}</TableCell>
                <TableCell className="player-info-table-cell-label">Birthdate</TableCell>
                <TableCell className="player-info-table-cell-value">{player.birthdate ? new Date(player.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</TableCell>
              </TableRow>
              <TableRow className="player-info-table-row">
                <TableCell className="player-info-table-cell-label">Weight</TableCell>
                <TableCell className="player-info-table-cell-value">{player.weight ? `${player.weight} lbs` : '0 lbs'}</TableCell>
                <TableCell className="player-info-table-cell-label">Handedness</TableCell>
                <TableCell className="player-info-table-cell-value">{player.handedness || 'N/A'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Player Statistics Section */}
      <Paper elevation={0} className="player-stats-section">
        <Box className="player-section-header">
          <Box className="player-section-icon stats-icon">
            <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" className="player-section-title">Season Statistics</Typography>
        </Box>
        {stats ? (
          <>
            {/* Season and Team Info */}
            <Box className="player-stats-chips">
              {stats.season && (
                <Chip label={`${stats.season.year} (${stats.season.type})`} className="player-stats-chip primary" />
              )}
              {stats.team && (
                <Chip label={`${stats.team.market} ${stats.team.name} (${stats.team.alias})`} className="player-stats-chip secondary" />
              )}
            </Box>
            {/* Enhanced Statistics Cards */}
            <Grid container spacing={3} className="player-stats-cards">
              <Grid item xs={6} md={3}>
                <Card className="player-stat-card games">
                  <CardContent className="player-stat-card-content">
                    <Sports sx={{ fontSize: 32, mb: 1, opacity: 0.9 }} />
                    <Typography variant="body2" className="player-stat-card-label">Games</Typography>
                    <Typography variant="h3" className="player-stat-card-value">{stats.statistics?.total?.games_played || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {renderStatCards(isGoalie(player), stats)}
            </Grid>
            {/* Enhanced Statistics Table */}
            <Paper elevation={2} className="player-stats-table">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="player-stats-table-header">
                      <TableCell className="player-stats-table-header-cell">Performance</TableCell>
                      <TableCell className="player-stats-table-header-cell">Value</TableCell>
                      <TableCell className="player-stats-table-header-cell">Advanced</TableCell>
                      <TableCell className="player-stats-table-header-cell">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {renderStatTableRows(isGoalie(player), stats)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        ) : (
          <Alert severity="info" className="player-stats-no-data">
            <Typography variant="body1" gutterBottom className="player-stats-no-data-title">Player statistics are currently unavailable</Typography>
            <Typography variant="body2">This may be due to:</Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>No regular season statistics available</li>
              <li>Player profile does not contain statistics data</li>
              <li>API limitations with the trial version</li>
            </Box>
          </Alert>
        )}
      </Paper>

      {/* Playoff Statistics Section - NEW LOCATION */}
      {playoffStats ? (
        <Paper elevation={0} className="player-playoff-section" sx={{ mt: 4 }}>
          <Box className="player-section-header">
            <Box className="player-section-icon playoff-icon">
              <EmojiEvents sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" className="player-section-title">Playoff Statistics ({playoffStats.season?.year})</Typography>
          </Box>
          {/* Playoff Season and Team Info */}
          <Box className="player-stats-chips">
            {playoffStats.season && (
              <Chip label={`${playoffStats.season.year} (${playoffStats.season.type})`} className="player-stats-chip primary" />
            )}
            {playoffStats.team && (
              <Chip label={`${playoffStats.team.market} ${playoffStats.team.name} (${playoffStats.team.alias})`} className="player-stats-chip secondary" />
            )}
          </Box>
          {/* Enhanced Playoff Statistics Cards */}
          <Grid container spacing={3} className="player-stats-cards">
            <Grid item xs={6} md={3}>
              <Card className="player-stat-card games">
                <CardContent className="player-stat-card-content">
                  <Sports sx={{ fontSize: 32, mb: 1, opacity: 0.9 }} />
                  <Typography variant="body2" className="player-stat-card-label">Games</Typography>
                  <Typography variant="h3" className="player-stat-card-value">{playoffStats.statistics?.total?.games_played || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            {renderStatCards(isGoalie(player), playoffStats)}
          </Grid>
          {/* Playoff Statistics Table (similar to regular stats) */}
          <Paper elevation={2} className="player-stats-table">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="player-stats-table-header">
                    <TableCell className="player-stats-table-header-cell">Performance</TableCell>
                    <TableCell className="player-stats-table-header-cell">Value</TableCell>
                    <TableCell className="player-stats-table-header-cell">Advanced</TableCell>
                    <TableCell className="player-stats-table-header-cell">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderStatTableRows(isGoalie(player), playoffStats)}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Paper>
      ) : (
        // If no playoffStats, render the placeholder outside the regular stats Paper as well
        <Paper elevation={0} className="player-playoff-section" sx={{ mt: 4 }}>
          <Box className="player-section-header">
            <Box className="player-section-icon playoff-icon">
              <EmojiEvents sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" className="player-section-title">Playoff Statistics (PST)</Typography>
          </Box>
          <Alert severity="info" className="player-playoff-info">
            <Typography variant="body1" gutterBottom className="player-playoff-info-title">Playoff statistics are currently unavailable for this player.</Typography>
            <Typography variant="body2">This may be due to:</Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>No playoff statistics recorded for the most recent season.</li>
              <li>Player did not participate in playoffs.</li>
              <li>API limitations with playoff data access.</li>
            </Box>
          </Alert>
        </Paper>
      )}
      <Footer />
    </Container>
  );
}

export default Player
