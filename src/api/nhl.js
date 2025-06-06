// src/api/nhl.js
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
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Please wait before making more requests.');
      error.message = 'Rate limit exceeded. Please wait and try again.';
    } else if (error.response?.status === 403) {
      console.warn('API access forbidden. Check your API key.');
      error.message = 'Access forbidden. Please check your API key.';
    } else if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
      error.message = 'Resource not found.';
    }
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testAPI = () => {
  console.log('Testing API with key:', API_KEY ? 'Present' : 'Missing');
  console.log('Base URL:', api.defaults.baseURL);
  console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
  return api.get('/league/teams.json')
    .then(response => {
      console.log('API Test Success:', response.status);
      return response;
    })
    .catch(error => {
      console.error('API Test Failed:', error);
      throw error;
    });
};

// Fetch all teams (filter out non-NHL teams like national teams)
export const getTeams = () =>
  api.get('/league/teams.json')
    .then((res) => {
      console.log('API Response:', res);
      console.log('Raw teams data:', res.data.teams);
      
      // Log team structure to understand the data
      if (res.data.teams && res.data.teams.length > 0) {
        console.log('Sample team structure:', res.data.teams[0]);
      }
      
      // Filter out non-NHL teams based on known patterns
      const nhlTeams = res.data.teams.filter(team => {
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
      
      const mappedTeams = nhlTeams.map((t) => ({
        id: t.id,
        name: t.name,
        market: t.market,
        alias: t.alias,
        conference: t.conference || null,
        division: t.division || null,
      }));
      
      console.log('Filtered NHL teams:', mappedTeams);
      console.log('Team count:', mappedTeams.length);
      return mappedTeams;
    })
    .catch((error) => {
      console.error('API Error Details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      throw error;
    });

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
export const getPlayerStats = async (playerId) => {
  console.log('Fetching player stats for:', playerId);
  
  try {
    // Get player profile which contains comprehensive statistics
    console.log('Fetching player profile for statistics...');
    const response = await api.get(`/players/${playerId}/profile.json`);
    console.log('Player profile fetched successfully');
    
    const playerData = response.data;
    
    // Extract seasons data
    if (!playerData.seasons || playerData.seasons.length === 0) {
      console.warn('No seasons data found in player profile');
      return null;
    }
    
    // Find the most recent regular season (REG) statistics
    // Sort seasons by year descending to get the most recent first
    const regularSeasons = playerData.seasons
      .filter(season => season.type === 'REG')
      .sort((a, b) => b.year - a.year);
    
    if (regularSeasons.length === 0) {
      console.warn('No regular season statistics found');
      return null;
    }
    
    const currentSeason = regularSeasons[0];
    console.log(`Using ${currentSeason.year} regular season statistics`);
    
    // Extract statistics from the most recent team in the season
    if (!currentSeason.teams || currentSeason.teams.length === 0) {
      console.warn('No team statistics found for current season');
      return null;
    }
    
    // Use the most recent team (last in array)
    const currentTeam = currentSeason.teams[currentSeason.teams.length - 1];
    
    if (!currentTeam.statistics) {
      console.warn('No statistics found for current team');
      return null;
    }
    
    // Return the statistics in a format that the component expects
    return {
      season: currentSeason,
      team: currentTeam,
      statistics: currentTeam.statistics
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
      console.log(`SUCCESS! Response from ${endpoint}:`, response.data);
      
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
      console.log(`Failed ${endpoint}:`, error.response?.status, error.message);
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
