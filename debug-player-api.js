// Debug script to test player API endpoints
import axios from 'axios';

const API_KEY = 'eqREPzeLl1cH2j4dwYnuy4VzMPhrp20i0CG0D4d9';
const baseURL = 'https://api.sportradar.com/nhl/trial/v7/en';

const api = axios.create({
  baseURL: baseURL,
  params: { api_key: API_KEY },
});

// Test player ID from the error log
const testPlayerId = '42787303-0f24-11e2-8525-18a905767e44';

async function testPlayerEndpoints() {
  console.log('Testing player endpoints...');
  
  // Test player profile
  try {
    console.log('\n=== PLAYER PROFILE ===');
    const profile = await api.get(`/players/${testPlayerId}/profile.json`);
    console.log('Player profile data keys:', Object.keys(profile.data));
    console.log('Player profile data:', JSON.stringify(profile.data, null, 2));
  } catch (error) {
    console.error('Player profile failed:', error.response?.status, error.message);
  }
  
  // Test different possible statistics endpoints
  const statsEndpoints = [
    `/players/${testPlayerId}/statistics.json`,
    `/seasons/2024/REG/players/${testPlayerId}/statistics.json`,
    `/seasons/2025/REG/players/${testPlayerId}/statistics.json`,
    `/seasons/2023/REG/players/${testPlayerId}/statistics.json`,
  ];
  
  for (const endpoint of statsEndpoints) {
    try {
      console.log(`\n=== TESTING: ${endpoint} ===`);
      const response = await api.get(endpoint);
      console.log('SUCCESS! Response keys:', Object.keys(response.data));
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      break; // If we find one that works, stop testing
    } catch (error) {
      console.log(`Failed ${endpoint}:`, error.response?.status, error.message);
    }
  }
}

testPlayerEndpoints().catch(console.error);
