import React, { useState, useEffect } from 'react';
import { getPlayoffSchedule, getPlayoffStandings } from '../api/nhl';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
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

const PlayoffBracket = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayoffData = async () => {
      try {
        console.log('🏒 Fetching playoff data...');
        
        // Try multiple season years since we're not sure which one has the current playoffs
        const seasonsToTry = ['2024', '2025', '2023'];
        let scheduleData = null;
        
        for (const season of seasonsToTry) {
          try {
            console.log(`🔍 Trying season ${season}...`);
            const scheduleResponse = await getPlayoffSchedule(season);
            console.log(`✅ Found playoff data for season ${season}:`, scheduleResponse);
            
            if (scheduleResponse?.series && scheduleResponse.series.length > 0) {
              scheduleData = scheduleResponse;
              console.log(`🎯 Using season ${season} - found ${scheduleResponse.series.length} series`);
              break;
            }
          } catch (err) {
            console.log(`❌ No playoff data for season ${season}:`, err.message);
          }
        }
        
        // Try to get standings for the same season
        if (scheduleData) {
          try {
            await getPlayoffStandings();
            console.log('✅ Playoff standings loaded');
          } catch (err) {
            console.warn('⚠️ Failed to load playoff standings:', err.message);
          }
        }        
        setSchedule(scheduleData);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Error fetching playoff data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchPlayoffData();
  }, []);

  const SeriesCard = ({ series, isCompact = false }) => {
    const team1 = series.teams?.[0];
    const team2 = series.teams?.[1];
    
    if (!team1 || !team2) {
      // Show placeholder for empty matchup
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
            justifyContent: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            TBD
          </Typography>
        </Paper>
      );
    }

    const team1Wins = series.win_count?.team1 || 0;
    const team2Wins = series.win_count?.team2 || 0;
    const isSeriesComplete = series.status === 'closed' || series.status === 'complete';
    const winner = isSeriesComplete ? (team1Wins > team2Wins ? team1 : team2) : null;

    return (
      <Paper 
        elevation={isSeriesComplete ? 3 : 2} 
        className={`matchup-card ${isSeriesComplete ? 'series-complete winner-highlight' : ''}`}
        sx={{ 
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
            boxShadow: 3
          }
        }}
      >
        {/* Series Status Badge */}
        {isSeriesComplete && (
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
              height: '20px'
            }}
          />
        )}

        <Stack spacing={isCompact ? 0.5 : 1}>
          {/* Team 1 */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
              opacity: winner && winner.id !== team1.id ? 0.6 : 1,
              backgroundColor: winner && winner.id === team1.id ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
              borderRadius: 1,
              p: 0.5
            }}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <TeamLogo team={team1} size={isCompact ? 20 : 28} />
              <Typography 
                variant={isCompact ? "caption" : "body2"} 
                sx={{ 
                  ml: 1,
                  fontWeight: winner && winner.id === team1.id ? 'bold' : 'normal',
                  fontSize: isCompact ? '0.7rem' : '0.875rem',
                  flex: 1
                }}
              >
                {isCompact ? team1.alias || `${team1.market} ${team1.name}` : `${team1.market} ${team1.name}`}
              </Typography>
            </Box>
            {isSeriesComplete && (
              <Typography 
                variant={isCompact ? "caption" : "body2"} 
                sx={{ 
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}
              >
                {team1Wins}
              </Typography>
            )}
          </Box>
          
          {/* Divider or VS */}
          <Box textAlign="center" sx={{ py: 0.2 }}>
            {isSeriesComplete ? (
              <Divider sx={{ bgcolor: '#4caf50', height: 2 }} />
            ) : (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666',
                  fontSize: '0.6rem',
                  fontWeight: 'bold'
                }}
              >
                vs
              </Typography>
            )}
          </Box>
          
          {/* Team 2 */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
              opacity: winner && winner.id !== team2.id ? 0.6 : 1,
              backgroundColor: winner && winner.id === team2.id ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
              borderRadius: 1,
              p: 0.5
            }}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <TeamLogo team={team2} size={isCompact ? 20 : 28} />
              <Typography 
                variant={isCompact ? "caption" : "body2"}
                sx={{ 
                  ml: 1,
                  fontWeight: winner && winner.id === team2.id ? 'bold' : 'normal',
                  fontSize: isCompact ? '0.7rem' : '0.875rem',
                  flex: 1
                }}
              >
                {isCompact ? team2.alias || `${team2.market} ${team2.name}` : `${team2.market} ${team2.name}`}
              </Typography>
            </Box>
            {isSeriesComplete && (
              <Typography 
                variant={isCompact ? "caption" : "body2"} 
                sx={{ 
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}
              >
                {team2Wins}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    );
  };

  const BracketLayout = ({ groupedSeries }) => {
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
            {(westernFirstRound.length > 0 ? westernFirstRound : Array(4).fill(null)).slice(0, 4).map((series, index) => (
              <CompactSeriesCard 
                key={index} 
                series={series} 
              />
            ))}
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
            {(westernSecondRound.length > 0 ? westernSecondRound : Array(2).fill(null)).slice(0, 2).map((series, index) => (
              <CompactSeriesCard key={index} series={series} />
            ))}
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
            {westernConferenceFinal.length > 0 ? (
              <CompactSeriesCard series={westernConferenceFinal[0]} />
            ) : (
              <CompactSeriesCard series={null} />
            )}
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
            {stanleyCupFinal.length > 0 ? (
              <CompactSeriesCard series={stanleyCupFinal[0]} isFinal={true} />
            ) : (
              <CompactSeriesCard series={null} isFinal={true} />
            )}
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
            {easternConferenceFinal.length > 0 ? (
              <CompactSeriesCard series={easternConferenceFinal[0]} />
            ) : (
              <CompactSeriesCard series={null} />
            )}
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
            {(easternSecondRound.length > 0 ? easternSecondRound : Array(2).fill(null)).slice(0, 2).map((series, index) => (
              <CompactSeriesCard key={index} series={series} />
            ))}
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
            {(easternFirstRound.length > 0 ? easternFirstRound : Array(4).fill(null)).slice(0, 4).map((series, index) => (
              <CompactSeriesCard 
                key={index} 
                series={series} 
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Compact series card for the grid layout
  const CompactSeriesCard = ({ series, isFinal = false }) => {
    const team1 = series?.teams?.[0];
    const team2 = series?.teams?.[1];
    
    if (!series || !team1 || !team2) {
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

    const team1Wins = series.win_count?.team1 || 0;
    const team2Wins = series.win_count?.team2 || 0;
    const isSeriesComplete = series.status === 'closed' || series.status === 'complete';
    const isSeriesActive = series.status === 'inprogress';
    const winner = isSeriesComplete ? (team1Wins > team2Wins ? team1 : team2) : null;

    const borderColor = isSeriesComplete ? '#4caf50' : isSeriesActive ? '#ff5722' : '#e0e0e0';
    const backgroundColor = isSeriesComplete ? '#e8f5e8' : isSeriesActive ? '#fff3e0' : '#ffffff';

    return (
      <Paper 
        elevation={isSeriesComplete ? 3 : 2}
        sx={{ 
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
        }}
      >
        {/* Seed badge removed */}

        <Stack spacing={0.5} sx={{ p: { xs: 1, sm: 1.5 } }}>
          {/* Team 1 */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
              backgroundColor: winner && winner.id === team1.id ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
              borderRadius: 0.5,
              p: 0.5
            }}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <TeamLogo team={team1} size={{ xs: 14, sm: 16 }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  ml: 0.5,
                  fontWeight: winner && winner.id === team1.id ? 'bold' : 'normal',
                  fontSize: { xs: '0.65rem', sm: '0.7rem' }
                }}
              >
                {team1.alias || team1.name}
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
                {team1Wins}
              </Typography>
            )}
          </Box>
          
          {/* Team 2 */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{
              backgroundColor: winner && winner.id === team2.id ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
              borderRadius: 0.5,
              p: 0.5
            }}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <TeamLogo team={team2} size={{ xs: 14, sm: 16 }} />
              <Typography 
                variant="caption"
                sx={{ 
                  ml: 0.5,
                  fontWeight: winner && winner.id === team2.id ? 'bold' : 'normal',
                  fontSize: { xs: '0.65rem', sm: '0.7rem' }
                }}
              >
                {team2.alias || team2.name}
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
                {team2Wins}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Series Status */}
        {isSeriesActive && (
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
        )}
        {isSeriesComplete && (
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
        )}
      </Paper>
    );
  };

  const RoundSection = ({ round, series }) => (
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
        {series.map((s, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <SeriesCard series={s} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
      // Map participants to teams for compatibility
      if (series.participants && series.participants.length >= 2) {
        series.teams = series.participants.map(participant => ({
          id: participant.team.id,
          name: participant.team.name,
          market: participant.team.market,
          alias: participant.team.alias,
          seed: participant.seed
        }));
        
        // Add win counts for series tracking (record is the wins in this series)
        series.win_count = {
          team1: series.participants[0].record || 0,
          team2: series.participants[1].record || 0
        };
      }
      
      // Determine round name
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
      {/* Header */}
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
            mb: 2
          }}
        >
          🏆 NHL Playoff Bracket
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          2024-25 Stanley Cup Playoffs
        </Typography>
      </Box>

      {/* Playoff Bracket */}
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
          
          {/* Demo Bracket for Development */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976d2' }}>
            Preview: Tournament Bracket Layout
          </Typography>
          <BracketLayout groupedSeries={{}} />
        </Card>
      )}
      
      <Footer />
    </Container>
  );
};

export default PlayoffBracket;
