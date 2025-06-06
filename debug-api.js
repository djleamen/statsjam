// Quick test to debug the actual API responses
const fs = require('fs');

// Using fetch to test the API directly
async function testAPI() {
  const API_KEY = 'eqREPzeLl1cH2j4dwYnuy4VzMPhrp20i0CG0D4d9';
  const baseURL = 'https://api.sportradar.com/nhl/trial/v7/en';
  
  try {
    // First get teams
    console.log('Fetching teams...');
    const teamsResponse = await fetch(`${baseURL}/league/teams.json?api_key=${API_KEY}`);
    const teamsData = await teamsResponse.json();
    
    console.log(`Found ${teamsData.teams.length} teams`);
    
    // Get first NHL team
    const firstTeam = teamsData.teams.find(t => t.market && t.name && t.alias);
    console.log(`Testing with: ${firstTeam.market} ${firstTeam.name} (${firstTeam.id})`);
    
    // Test different endpoints
    const endpoints = [
      `/teams/${firstTeam.id}/profile.json`,
      `/seasons/2024/REG/teams/${firstTeam.id}/statistics.json`,
      `/seasons/2025/REG/teams/${firstTeam.id}/statistics.json`,
      `/seasons/2023/REG/teams/${firstTeam.id}/statistics.json`,
      `/teams/${firstTeam.id}/statistics.json`,
      `/league/standings.json`,
      `/seasons/2024/REG/standings.json`
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${endpoint}`);
        const response = await fetch(`${baseURL}${endpoint}?api_key=${API_KEY}`);
        
        if (response.ok) {
          const data = await response.json();
          results[endpoint] = {
            status: 'SUCCESS',
            data: data,
            keys: Object.keys(data)
          };
          console.log(`✓ ${endpoint} - SUCCESS`);
        } else {
          results[endpoint] = {
            status: 'FAILED',
            statusCode: response.status,
            statusText: response.statusText
          };
          console.log(`✗ ${endpoint} - ${response.status} ${response.statusText}`);
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results[endpoint] = {
          status: 'ERROR',
          error: error.message
        };
        console.log(`✗ ${endpoint} - ERROR: ${error.message}`);
      }
    }
    
    // Save results to file
    fs.writeFileSync('./api-debug-results.json', JSON.stringify(results, null, 2));
    console.log('Results saved to api-debug-results.json');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
