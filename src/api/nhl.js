import axios from 'axios';

// Configure Sportradar API client
const API_KEY = import.meta.env.VITE_SPORT_RADAR_API_KEY;
// Use current season by default (2024-2025 season is represented as "2024")
const SEASON = import.meta.env.VITE_NHL_SEASON || '2024';

// Use proxy in development, direct API in production
const baseURL = import.meta.env.DEV 
  ? '/api/sportradar/nhl/trial/v7/en'
  : 'https://api.sportradar.com/nhl/trial/v7/en';

const api = axios.create({
  baseURL: baseURL,
  params: { api_key: API_KEY },
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'StatsJam/1.0'
  }
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Request Failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('Network connectivity issue detected');
      error.message = 'Network connection failed. Please check your internet connection and try again.';
    } else if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please wait before making more requests.');
      error.message = 'Rate limit exceeded. Please wait and try again.';
    } else if (error.response?.status === 403) {
      console.warn('API access forbidden. Check your API key.');
      error.message = 'Access forbidden. Please check your API key.';
    } else if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
      error.message = 'Resource not found.';
    } else if (error.response?.status === 500) {
      console.warn('Server error:', error.config?.url);
      error.message = 'Server error. Please try again later.';
    }
    return Promise.reject(error);
  }
);



// Mock data for development when API is unavailable
const mockTeams = [
  {
    id: "583ec825-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Rangers",
    market: "New York",
    alias: "NYR",
    conference: { name: "Eastern Conference" },
    division: { name: "Metropolitan" }
  },
  {
    id: "583ec773-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Bruins", 
    market: "Boston",
    alias: "BOS",
    conference: { name: "Eastern Conference" },
    division: { name: "Atlantic" }
  },
  {
    id: "583ec5fd-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Maple Leafs",
    market: "Toronto", 
    alias: "TOR",
    conference: { name: "Eastern Conference" },
    division: { name: "Atlantic" }
  },
  {
    id: "583ec50e-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Lightning",
    market: "Tampa Bay",
    alias: "TBL", 
    conference: { name: "Eastern Conference" },
    division: { name: "Atlantic" }
  },
  {
    id: "583ec87d-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Oilers",
    market: "Edmonton",
    alias: "EDM",
    conference: { name: "Western Conference" }, 
    division: { name: "Pacific" }
  },
  {
    id: "583ec928-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Kings",
    market: "Los Angeles",
    alias: "LAK",
    conference: { name: "Western Conference" },
    division: { name: "Pacific" }
  },
  {
    id: "583ec8d4-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Avalanche", 
    market: "Colorado",
    alias: "COL",
    conference: { name: "Western Conference" },
    division: { name: "Central" }
  },
  {
    id: "583ec56e-fb46-11e1-82cb-f4ce4684ea4c",
    name: "Blackhawks",
    market: "Chicago", 
    alias: "CHI",
    conference: { name: "Western Conference" },
    division: { name: "Central" }
  }
];

// Fetch all teams (filter out non-NHL teams like national teams)
export const getTeams = async () => {
  console.log('🏒 Fetching NHL teams...');
  
  try {
    const response = await api.get('/league/teams.json');
    console.log('✅ API Response received:', response.status);
    console.log('🔍 Raw teams data:', response.data.teams);
    
    // Log team structure to understand the data
    if (response.data.teams && response.data.teams.length > 0) {
      console.log('📊 Sample team structure:', response.data.teams[0]);
    }
    
    // Filter out non-NHL teams based on known patterns
    const nhlTeams = response.data.teams.filter(team => {
      // Filter out national teams
      const nationalTeams = ['Team Canada', 'Team Finland', 'Team Sweden', 'Team USA', 'Team Czech Republic'];
      if (nationalTeams.includes(`${team.market} ${team.name}`) || 
          ['Canada', 'Finland', 'Sweden', 'USA'].includes(team.name)) {
        return false;
      }
      
      // Filter out division entries
      if (team.name === 'Division') {
        return false;
      }
      
      // Filter out special team entries (Hughes, MacKinnon, Matthews, McDavid, TBD)
      const specialTeams = ['Hughes', 'MacKinnon', 'Matthews', 'McDavid', 'TBD'];
      if (specialTeams.includes(team.name)) {
        return false;
      }
      
      // Filter out European teams
      const europeanTeams = ['EHC Red Bull Munchen', 'Eisbaren Berlin', 'SC Bern'];
      if (europeanTeams.includes(team.name)) {
        return false;
      }
      
      // Keep teams that look like NHL teams (have proper market and name)
      return team.market && team.name && team.alias;
    });
    
    const mappedTeams = nhlTeams.map((t) => {
      let standardizedConferenceName = null;
      if (t.conference?.name) {
        const apiConfNameLower = t.conference.name.toLowerCase();
        if (apiConfNameLower.includes('eastern')) {
          standardizedConferenceName = 'Eastern Conference';
        } else if (apiConfNameLower.includes('western')) {
          standardizedConferenceName = 'Western Conference';
        } else {
          standardizedConferenceName = t.conference.name; // Keep original if not Eastern/Western
        }
      }

      const divisionObject = t.division ? { name: t.division.name } : null;

      return {
        id: t.id,
        name: t.name,
        market: t.market,
        alias: t.alias,
        conference: standardizedConferenceName ? { name: standardizedConferenceName } : null,
        division: divisionObject,
      };
    });
    
    console.log('🏆 Filtered NHL teams:', mappedTeams);
    console.log('📈 Team count:', mappedTeams.length);
    return mappedTeams;
    
  } catch (error) {
    console.error('❌ API Error Details:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    
    // Check if it's a network error and we're in development
    if ((error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || 
         error.code === 'ETIMEDOUT' || error.message.includes('network') || 
         error.message.includes('TLS')) && import.meta.env.DEV) {
      console.warn('🚨 API unavailable, using mock data for development');
      console.log('🎭 Mock teams loaded:', mockTeams.length);
      return mockTeams;
    }
    
    throw error;
  }
};

// Fetch team roster
export const getTeamRoster = (teamId) =>
  api.get(`/teams/${teamId}/profile.json`).then((res) => {
    console.log('Team roster data structure:', res.data);
    const players = res.data.players || [];
    console.log('Number of players in roster:', players.length);
    if (players.length > 0) {
      console.log('Sample player data:', players[0]);
    }
    return players;
  });

// Fetch player profile
export const getPlayer = (playerId) =>
  api.get(`/players/${playerId}/profile.json`).then((res) => res.data);

// Fetch player season statistics
export const getPlayerStats = async (playerId, seasonType = 'REG') => {
  console.log(`Fetching player stats for: ${playerId}, season type: ${seasonType}`);

  try {
    const response = await api.get(`/players/${playerId}/profile.json`);
    console.log('Player profile fetched successfully');

    const playerData = response.data;

    console.log('Player basic info:', {
      id: playerData.id,
      name: playerData.full_name,
      position: playerData.primary_position,
      draft_year: playerData.draft?.year
    });

    if (!playerData.seasons || playerData.seasons.length === 0) {
      console.warn('No seasons data found in player profile');
      return null;
    }

    const filteredSeasons = playerData.seasons
      .filter(season => season.type === seasonType)
      .sort((a, b) => b.year - a.year);

    if (filteredSeasons.length === 0) {
      console.warn(`No ${seasonType} season statistics found`);
      return null;
    }

    const currentSeason = filteredSeasons[0];
    console.log(`Using ${currentSeason.year} ${seasonType} season statistics`);

    if (!currentSeason.teams || currentSeason.teams.length === 0) {
      console.warn('No team statistics found for current season');
      return null;
    }

    const currentTeam = currentSeason.teams[currentSeason.teams.length - 1];

    if (!currentTeam.statistics && !currentTeam.goaltending) {
      console.warn('No statistics or goaltending data found for current team');
      return null;
    }

    return {
      season: currentSeason,
      team: currentTeam,
      statistics: currentTeam.statistics || null,
      goaltending: currentTeam.goaltending || null,
      time_on_ice: currentTeam.time_on_ice || null
    };
  } catch (error) {
    console.error('Failed to fetch player statistics:', error.response?.status, error.message);
    return null;
  }
};

// Fetch team season statistics
export const getTeamStats = async (teamId) => {
  console.log('Fetching team stats for:', teamId);
  
  // Try different endpoints that might have statistics
  const endpoints = [
    // Season-specific endpoints
    `/seasons/2024/REG/teams/${teamId}/statistics.json`,
    `/seasons/2025/REG/teams/${teamId}/statistics.json`,
    `/seasons/2023/REG/teams/${teamId}/statistics.json`,
    `/seasons/2024/PST/teams/${teamId}/statistics.json`,
    
    // Team-specific endpoints
    `/teams/${teamId}/statistics.json`,
    `/teams/${teamId}/profile.json`,
    
    // League-wide endpoints that might include team stats
    `/seasons/2024/REG/standings.json`,
    `/league/standings.json`,
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const response = await api.get(endpoint);
      console.log('SUCCESS! Response from %s:', endpoint, response.data);
      
      // If it's standings data, extract the team's stats
      if (endpoint.includes('standings')) {
        const standings = response.data.standings || response.data;
        if (Array.isArray(standings)) {
          const teamStats = standings.find(team => team.id === teamId || team.team?.id === teamId);
          if (teamStats) {
            console.log('Found team in standings:', teamStats);
            return teamStats;
          }
        }
      }
      
      return response.data;
    } catch (error) {
      console.log('Failed %s: %s %s', endpoint, error.response?.status, error.message);
    }
  }
  
  console.warn('No team statistics found from any endpoint');
  return null;
};

// Fetch team profile and stats
export const getTeam = (teamId) =>
  api.get(`/teams/${teamId}/profile.json`).then((res) => {
    console.log('Team profile data:', res.data);
    return res.data;
  });

// Fetch playoff series schedule
export const getPlayoffSchedule = (season = SEASON) => {
  console.log(`🔍 Fetching playoff schedule for season: ${season}`);
  return api.get(`/series/${season}/PST/schedule.json`).then((res) => {
    console.log('🏒 Playoff schedule data:', res.data);
    console.log('🎯 Series count:', res.data?.series?.length || 0);
    if (res.data?.series) {
      res.data.series.forEach((series, index) => {
        console.log(`Series ${index + 1}:`, {
          title: series.title,
          round: series.round,
          status: series.status,
          participants: series.participants?.map(p => `${p.team.market} ${p.team.name}`) || []
        });
      });
    }
    return res.data;
  });
};

// Fetch series statistics for a specific team
export const getSeriesStats = (seriesId, teamId) =>
  api.get(`/series/${seriesId}/teams/${teamId}/statistics.json`).then((res) => {
    console.log('Series statistics data:', res.data);
    return res.data;
  });

// Fetch playoff standings
export const getPlayoffStandings = (season = SEASON) =>
  api.get(`/seasons/${season}/PST/standings.json`).then((res) => {
    console.log('Playoff standings data:', res.data);
    return res.data;
  });
