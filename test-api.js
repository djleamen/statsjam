// Quick test to see what the API actually returns
import axios from 'axios';

const API_KEY = 'eqREPzeLl1cH2j4dwYnuy4VzMPhrp20i0CG0D4d9';
const SEASON = '2024';

const api = axios.create({
  baseURL: 'https://api.sportradar.com/nhl/trial/v7/en',
  params: { api_key: API_KEY },
});

async function testTeamStats() {
  try {
    // Get teams first
    console.log('Fetching teams...');
    const teamsResponse = await api.get('/league/teams.json');
    const teams = teamsResponse.data.teams.slice(0, 3); // Just test first 3 teams
    
    console.log('Found teams:', teams.map(t => `${t.market} ${t.name} (${t.id})`));
    
    // Test stats for first team
    const firstTeam = teams[0];
    console.log(`\nTesting stats for: ${firstTeam.market} ${firstTeam.name} (ID: ${firstTeam.id})`);
    
    // Try different endpoints
    const endpoints = [
      `/seasons/${SEASON}/REG/teams/${firstTeam.id}/statistics.json`,
      `/seasons/${SEASON}/PST/teams/${firstTeam.id}/statistics.json`,
      `/teams/${firstTeam.id}/statistics.json`,
      `/teams/${firstTeam.id}/profile.json`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\nTrying: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log('Success! Response structure:', Object.keys(response.data));
        console.log('Sample data:', JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
        break;
      } catch (error) {
        console.log(`Failed: ${error.response?.status} - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testTeamStats();
