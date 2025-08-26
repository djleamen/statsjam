import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPlayoffSchedule, getPlayoffStandings } from '../api/nhl';
import {
  Container,
  Typography,
  Box,
  Card,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import TeamLogo from '../components/TeamLogo';
import Footer from '../components/Footer';
import '../styles/PlayoffBracket.css';


function SeriesCard({ series, isCompact = false }) {
  const team1 = series.teams?.[0];
  const team2 = series.teams?.[1];
  
  if (!team1 || !team2) {
    return <EmptySeriesCard isCompact={isCompact} />;
  }

  const seriesData = getSeriesData(series);
  
  return (
    <CompletedSeriesCard 
      team1={team1}
      team2={team2}
      seriesData={seriesData}
      isCompact={isCompact}
    />
  );
}

function EmptySeriesCard({ isCompact }) {
  return (
    <Paper
      elevation={1}
      className="matchup-card"
      sx={{
        p: isCompact ? 1.5 : 2,
        mb: 0.5,
        backgroundColor: '#f8f9fa',
        border: '2px dashed #e0e0e0',
        borderRadius: 2,
        minHeight: isCompact ? '70px' : '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        TBD
      </Typography>
    </Paper>
  );
}

function getSeriesData(series) {
  const team1Wins = series.win_count?.team1 || 0;
  const team2Wins = series.win_count?.team2 || 0;
  const isSeriesComplete = series.status === 'closed' || series.status === 'complete';
  
  let winner = null;
  if (isSeriesComplete) {
    if (team1Wins > team2Wins) {
      winner = series.teams[0];
    } else {
      winner = series.teams[1];
    }
  }
  
  return {
    team1Wins,
    team2Wins,
    isSeriesComplete,
    winner,
    showDivider: isSeriesComplete
  };
}

function CompletedSeriesCard({ team1, team2, seriesData, isCompact }) {
  const { isSeriesComplete } = seriesData;
  
  return (
    <Paper
      elevation={isSeriesComplete ? 3 : 2}
      className={`matchup-card${isSeriesComplete ? ' series-complete winner-highlight' : ''}`}
      sx={getSeriesCardStyles(isSeriesComplete, isCompact)}
    >
      {isSeriesComplete && <SeriesCompleteChip />}
      <Stack spacing={isCompact ? 0.5 : 1}>
        <TeamRow 
          team={team1} 
          teamWins={seriesData.team1Wins}
          seriesData={seriesData}
          isCompact={isCompact}
        />
        <SeriesDivider showDivider={seriesData.showDivider} />
        <TeamRow 
          team={team2} 
          teamWins={seriesData.team2Wins}
          seriesData={seriesData}
          isCompact={isCompact}
        />
      </Stack>
    </Paper>
  );
}

function getSeriesCardStyles(isSeriesComplete, isCompact) {
  return {
    p: isCompact ? 1.5 : 2,
    mb: 0.5,
    backgroundColor: isSeriesComplete ? '#e8f5e8' : '#ffffff',
    border: `2px solid ${isSeriesComplete ? '#4caf50' : '#e0e0e0'}`,
    borderRadius: 2,
    minHeight: isCompact ? '70px' : '100px',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 3,
    },
  };
}

function SeriesCompleteChip() {
  return (
    <Chip
      label="FINAL"
      size="small"
      color="success"
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        fontSize: '0.65rem',
        fontWeight: 'bold',
        height: '20px',
      }}
    />
  );
}

function TeamRow({ team, teamWins, seriesData, isCompact }) {
  const { winner, isSeriesComplete } = seriesData;
  const isWinner = winner && winner.id === team.id;
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={getTeamRowStyles(winner, team.id)}
    >
      <Box display="flex" alignItems="center" flex={1}>
        <TeamLogo team={team} size={isCompact ? 20 : 28} />
        <Typography
          variant={isCompact ? 'caption' : 'body2'}
          sx={getTeamNameStyles(isWinner, isCompact)}
        >
          {getTeamDisplayName(team, isCompact)}
        </Typography>
      </Box>
      {isSeriesComplete && (
        <Typography
          variant={isCompact ? 'caption' : 'body2'}
          sx={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}
        >
          {teamWins}
        </Typography>
      )}
    </Box>
  );
}

function getTeamRowStyles(winner, teamId) {
  return {
    opacity: winner && winner.id !== teamId ? 0.6 : 1,
    backgroundColor: winner && winner.id === teamId ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
    borderRadius: 1,
    p: 0.5,
  };
}

function getTeamNameStyles(isWinner, isCompact) {
  return {
    ml: 1,
    fontWeight: isWinner ? 'bold' : 'normal',
    fontSize: isCompact ? '0.7rem' : '0.875rem',
    flex: 1,
  };
}

function getTeamDisplayName(team, isCompact) {
  if (isCompact) {
    return team.alias ? team.alias : `${team.market} ${team.name}`;
  }
  return `${team.market} ${team.name}`;
}

function SeriesDivider({ showDivider }) {
  return (
    <Box textAlign="center" sx={{ py: 0.2 }}>
      {showDivider ? (
        <Divider sx={{ bgcolor: '#4caf50', height: 2 }} />
      ) : (
        <Typography
          variant="caption"
          sx={{ color: '#666', fontSize: '0.6rem', fontWeight: 'bold' }}
        >
          vs
        </Typography>
      )}
    </Box>
  );
}

function BracketLayout({ groupedSeries }) {
    // Organize series by conference for proper bracket structure
    const firstRound = groupedSeries['First Round'] || [];
    const secondRound = groupedSeries['Second Round'] || [];
    const conferenceFinals = groupedSeries['Conference Finals'] || [];
    const stanleyCupFinal = groupedSeries['Stanley Cup Final'] || [];

    // Enhanced conference team mapping for better organization
    const easternTeams = ['FLA', 'CAR', 'WSH', 'TOR', 'TB', 'NJ', 'MTL', 'OTT', 'NYR', 'NYI', 'PHI', 'PIT', 'BOS', 'BUF', 'DET', 'CBJ'];
    const westernTeams = ['EDM', 'DAL', 'WPG', 'STL', 'COL', 'LA', 'VGK', 'MIN', 'VAN', 'CGY', 'SEA', 'SJ', 'ANA', 'ARI', 'CHI', 'NSH'];

    // Split first round by conference using team aliases
    const easternFirstRound = firstRound.filter(series => {
      if (series.title?.includes('Eastern')) return true;
      return series.teams?.some(team => easternTeams.includes(team.alias));
    });
    const westernFirstRound = firstRound.filter(series => {
      if (series.title?.includes('Western')) return true;
      return series.teams?.some(team => westernTeams.includes(team.alias));
    });

    // Split other rounds by conference
    const easternSecondRound = secondRound.filter(series => {
      if (series.title?.includes('Eastern')) return true;
      return series.teams?.some(team => easternTeams.includes(team.alias));
    });
    const westernSecondRound = secondRound.filter(series => {
      if (series.title?.includes('Western')) return true;
      return series.teams?.some(team => westernTeams.includes(team.alias));
    });
    const easternConferenceFinal = conferenceFinals.filter(series => {
      if (series.title?.includes('Eastern')) return true;
      return series.teams?.some(team => easternTeams.includes(team.alias));
    });
    const westernConferenceFinal = conferenceFinals.filter(series => {
      if (series.title?.includes('Western')) return true;
      return series.teams?.some(team => westernTeams.includes(team.alias));
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        {/* Main Bracket Grid */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 1.2fr',
            gridTemplateRows: 'auto auto auto auto auto auto',
            gap: { xs: 1, sm: 1.5, md: 2 },
            maxWidth: '1400px',
            width: '100%',
            px: { xs: 1, sm: 2 },
            minHeight: '500px',
            alignItems: 'center'
          }}
        >
          {/* Western Conference Header */}
          <Box sx={{ gridColumn: '1 / 4', textAlign: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: '#1565c0', 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              🏒 Western Conference
            </Typography>
          </Box>

          {/* Empty space for grid alignment */}
          <Box sx={{ gridColumn: '4' }}></Box>

          {/* Eastern Conference Header */}
          <Box sx={{ gridColumn: '5 / 8', textAlign: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: '#1565c0', 
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              🏒 Eastern Conference
            </Typography>
          </Box>

          {/* Western First Round */}
          <Box sx={{ gridColumn: '1', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              First Round
            </Typography>
            {(westernFirstRound.length > 0 ? westernFirstRound : Array(4).fill(null)).slice(0, 4).map((series, idx) => {
              const key = series?.id || series?.seriesId || series?.title || `westernFirstRound-${idx}`;
              return <CompactSeriesCard key={key} series={series} />;
            })}
          </Box>

          {/* Western Divisional Round */}
          <Box sx={{ gridColumn: '2', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              Divisional
            </Typography>
            {(westernSecondRound.length > 0 ? westernSecondRound : Array(2).fill(null)).slice(0, 2).map((series, idx) => {
              const key = series?.id || series?.seriesId || series?.title || `westernSecondRound-${idx}`;
              return <CompactSeriesCard key={key} series={series} />;
            })}
          </Box>

          {/* Western Conference Final */}
          <Box sx={{ gridColumn: '3', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              Conference Final
            </Typography>
            {(() => {
              if (westernConferenceFinal.length > 0) {
                return <CompactSeriesCard series={westernConferenceFinal[0]} />;
              }
              return <CompactSeriesCard series={null} />;
            })()}
          </Box>

          {/* Stanley Cup Final Game */}
          <Box sx={{ gridColumn: '4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold', 
              color: '#000', 
              textAlign: 'center',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1
            }}>
              Stanley Cup Final
            </Typography>
            {(() => {
              if (stanleyCupFinal.length > 0) {
                return <CompactSeriesCard series={stanleyCupFinal[0]} isFinal={true} />;
              }
              return <CompactSeriesCard series={null} isFinal={true} />;
            })()}
          </Box>

          {/* Eastern Conference Final */}
          <Box sx={{ gridColumn: '5', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              Conference Final
            </Typography>
            {(() => {
              if (easternConferenceFinal.length > 0) {
                return <CompactSeriesCard series={easternConferenceFinal[0]} />;
              }
              return <CompactSeriesCard series={null} />;
            })()}
          </Box>

          {/* Eastern Divisional Round */}
          <Box sx={{ gridColumn: '6', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              Divisional
            </Typography>
            {(easternSecondRound.length > 0 ? easternSecondRound : Array(2).fill(null)).slice(0, 2).map((series, idx) => {
              const key = series?.id || series?.seriesId || series?.title || `easternSecondRound-${idx}`;
              return <CompactSeriesCard key={key} series={series} />;
            })}
          </Box>

          {/* Eastern First Round */}
          <Box sx={{ gridColumn: '7', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              mb: 0.5
            }}>
              First Round
            </Typography>
            {(easternFirstRound.length > 0 ? easternFirstRound : Array(4).fill(null)).slice(0, 4).map((series, idx) => {
              const key = series?.id || series?.seriesId || series?.title || `easternFirstRound-${idx}`;
              return <CompactSeriesCard key={key} series={series} />;
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  // Helper function to render empty series card
function renderEmptySeriesCard(isFinal) {
  return (
    <Box sx={{ 
      border: '2px dashed #ddd', 
      borderRadius: 1.5, 
      p: { xs: 1, sm: 1.5 }, 
      textAlign: 'center',
      minHeight: { xs: '60px', sm: isFinal ? '100px' : '80px' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      transition: 'all 0.2s ease'
    }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
        TBD
      </Typography>
    </Box>
  );
}

// Helper function to get series status data
function getSeriesStatus(series) {
  const team1Wins = series.win_count?.team1 || 0;
  const team2Wins = series.win_count?.team2 || 0;
  const isSeriesComplete = series.status === 'closed' || series.status === 'complete';
  const isSeriesActive = series.status === 'inprogress';
  let winner = null;
  if (isSeriesComplete) {
    if (team1Wins > team2Wins) {
      winner = series.teams[0];
    } else {
      winner = series.teams[1];
    }
  }

  return {
    team1Wins,
    team2Wins,
    isSeriesComplete,
    isSeriesActive,
    winner
  };
}

// Helper function to get card styling
function getCardStyling(statusData, isFinal) {
  const { isSeriesComplete, isSeriesActive } = statusData;
  let borderColor;
  let backgroundColor;
  if (isSeriesComplete) {
    borderColor = '#4caf50';
    backgroundColor = '#e8f5e8';
  } else if (isSeriesActive) {
    borderColor = '#ff5722';
    backgroundColor = '#fff3e0';
  } else {
    borderColor = '#e0e0e0';
    backgroundColor = '#ffffff';
  }

  return {
    border: `2px solid ${borderColor}`,
    borderRadius: 1.5,
    backgroundColor: backgroundColor,
    position: 'relative',
    minHeight: { xs: '60px', sm: isFinal ? '100px' : '80px' },
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: 4
    }
  };
}

// Helper function to render team row
function renderTeamRow(team, teamWins, winner, statusData) {
  const { isSeriesComplete, isSeriesActive } = statusData;
  const isWinner = winner && winner.id === team.id;

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      sx={{
        backgroundColor: isWinner ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
        borderRadius: 0.5,
        p: 0.5
      }}
    >
      <Box display="flex" alignItems="center" flex={1}>
        <TeamLogo team={team} size={{ xs: 14, sm: 16 }} />
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 0.5,
            fontWeight: isWinner ? 'bold' : 'normal',
            fontSize: { xs: '0.65rem', sm: '0.7rem' }
          }}
        >
          {team.alias || team.name}
        </Typography>
      </Box>
      {(isSeriesComplete || isSeriesActive) && (
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            minWidth: '16px',
            textAlign: 'center'
          }}
        >
          {teamWins}
        </Typography>
      )}
    </Box>
  );
}

// Helper function to render status chip
function renderStatusChip(statusData) {
  const { isSeriesActive, isSeriesComplete } = statusData;

  if (isSeriesActive) {
    return (
      <Chip 
        label="LIVE" 
        size="small"
        color="error"
        sx={{ 
          position: 'absolute',
          top: 2,
          right: 2,
          fontSize: { xs: '0.55rem', sm: '0.6rem' },
          height: { xs: '14px', sm: '16px' },
          '& .MuiChip-label': {
            px: 0.5
          }
        }}
      />
    );
  }

  if (isSeriesComplete) {
    return (
      <Chip 
        label="FINAL" 
        size="small"
        color="success"
        sx={{ 
          position: 'absolute',
          top: 2,
          right: 2,
          fontSize: { xs: '0.55rem', sm: '0.6rem' },
          height: { xs: '14px', sm: '16px' },
          '& .MuiChip-label': {
            px: 0.5
          }
        }}
      />
    );
  }

  return null;
}

// Compact series card for the grid layout
function CompactSeriesCard({ series, isFinal = false }) {
  const team1 = series?.teams?.[0];
  const team2 = series?.teams?.[1];
  
  if (!series || !team1 || !team2) {
    return renderEmptySeriesCard(isFinal);
  }

  const statusData = getSeriesStatus(series);
  const cardStyling = getCardStyling(statusData, isFinal);

  return (
    <Paper elevation={statusData.isSeriesComplete ? 3 : 2} sx={cardStyling}>
      <Stack spacing={0.5} sx={{ p: { xs: 1, sm: 1.5 } }}>
        {renderTeamRow(team1, statusData.team1Wins, statusData.winner, statusData)}
        {renderTeamRow(team2, statusData.team2Wins, statusData.winner, statusData)}
      </Stack>
      {renderStatusChip(statusData)}
    </Paper>
  );
};

function RoundSection({ round, series }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center"
        sx={{ 
          fontWeight: 'bold', 
          color: '#1976d2',
          mb: 3,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}
      >
        {round}
      </Typography>
      <Grid container spacing={2}>
        {series.map((s, idx) => {
          const key = s?.id || s?.seriesId || s?.title || `roundSection-${idx}`;
          return (
            <Grid item xs={12} md={6} lg={4} key={key}>
              <SeriesCard series={s} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

function PlayoffBracket() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayoffData() {
      try {
        const seasonsToTry = ['2024', '2025', '2023'];
        let scheduleData = null;
        for (const season of seasonsToTry) {
          try {
            const scheduleResponse = await getPlayoffSchedule(season);
            if (scheduleResponse?.series && scheduleResponse.series.length > 0) {
              scheduleData = scheduleResponse;
              break;
            }
          } catch (err) {
            console.warn(`Failed to fetch playoff schedule for season ${season}:`, err.message);
          }
        }
        if (scheduleData) {
          try {
            await getPlayoffStandings();
          } catch (err) {
            console.warn('Failed to fetch playoff standings:', err.message);
          }
        }
        setSchedule(scheduleData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchPlayoffData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading playoff bracket...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading playoff data: {error.message}
        </Alert>
      </Container>
    );
  }

  // Group series by round
  const groupedSeries = {};
  if (schedule?.series) {
    schedule.series.forEach(series => {
      if (series.participants && series.participants.length >= 2) {
        series.teams = series.participants.map(participant => ({
          id: participant.team.id,
          name: participant.team.name,
          market: participant.team.market,
          alias: participant.team.alias,
          seed: participant.seed,
        }));
        series.win_count = {
          team1: series.participants[0].record || 0,
          team2: series.participants[1].record || 0,
        };
      }
      let roundName;
      switch (series.round) {
        case 1:
          roundName = 'First Round';
          break;
        case 2:
          roundName = 'Second Round';
          break;
        case 3:
          roundName = 'Conference Finals';
          break;
        case 4:
          roundName = 'Stanley Cup Final';
          break;
        default:
          roundName = `Round ${series.round}`;
      }
      if (!groupedSeries[roundName]) {
        groupedSeries[roundName] = [];
      }
      groupedSeries[roundName].push(series);
    });
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          🏆 NHL Playoff Bracket
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          2024-25 Stanley Cup Playoffs
        </Typography>
      </Box>
      {Object.keys(groupedSeries).length > 0 ? (
        <BracketLayout groupedSeries={groupedSeries} />
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h5" gutterBottom>
            🏒 Playoff bracket not available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The playoff bracket will be available when the playoffs begin.
            Check back during the postseason for live playoff matchups and results!
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976d2' }}>
            Preview: Tournament Bracket Layout
          </Typography>
          <BracketLayout groupedSeries={{}} />
        </Card>
      )}
      <Footer />
    </Container>
  );
}


SeriesCard.propTypes = {
  series: PropTypes.shape({
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        market: PropTypes.string,
        alias: PropTypes.string,
        seed: PropTypes.any,
      })
    ),
    win_count: PropTypes.shape({
      team1: PropTypes.number,
      team2: PropTypes.number,
    }),
    status: PropTypes.string,
    title: PropTypes.string,
    round: PropTypes.number,
  }),
  isCompact: PropTypes.bool,
};

BracketLayout.propTypes = {
  groupedSeries: PropTypes.object.isRequired,
};

CompactSeriesCard.propTypes = {
  series: PropTypes.shape({
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        market: PropTypes.string,
        alias: PropTypes.string,
        seed: PropTypes.any,
      })
    ),
    win_count: PropTypes.shape({
      team1: PropTypes.number,
      team2: PropTypes.number,
    }),
    status: PropTypes.string,
    title: PropTypes.string,
    round: PropTypes.number,
  }),
  isFinal: PropTypes.bool,
};

RoundSection.propTypes = {
  round: PropTypes.string.isRequired,
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
};

EmptySeriesCard.propTypes = {
  isCompact: PropTypes.bool,
};

CompletedSeriesCard.propTypes = {
  team1: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    market: PropTypes.string,
    alias: PropTypes.string,
    seed: PropTypes.any,
  }),
  team2: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    market: PropTypes.string,
    alias: PropTypes.string,
    seed: PropTypes.any,
  }),
  seriesData: PropTypes.shape({
    team1Wins: PropTypes.number,
    team2Wins: PropTypes.number,
    isSeriesComplete: PropTypes.bool,
    winner: PropTypes.object,
    showDivider: PropTypes.bool,
  }),
  isCompact: PropTypes.bool,
};

TeamRow.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    market: PropTypes.string,
    alias: PropTypes.string,
    seed: PropTypes.any,
  }),
  teamWins: PropTypes.number,
  seriesData: PropTypes.shape({
    team1Wins: PropTypes.number,
    team2Wins: PropTypes.number,
    isSeriesComplete: PropTypes.bool,
    winner: PropTypes.object,
    showDivider: PropTypes.bool,
  }),
  isCompact: PropTypes.bool,
};

SeriesDivider.propTypes = {
  showDivider: PropTypes.bool,
};

export default PlayoffBracket;
