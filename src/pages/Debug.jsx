import React, { useState } from 'react';
import { getTeams, testAPI, getTeamStats } from '../api/nhl';
import { Container, Button, Typography, Box, Divider } from '@mui/material';

function Debug() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await testAPI();
      setResult(`Test API Success: ${response.status}\nData: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`Test API Error: ${error.message}\nDetails: ${JSON.stringify(error, null, 2)}`);
    }
    setLoading(false);
  };

  const testTeamStats = async () => {
    setLoading(true);
    try {
      // First get teams to get a valid team ID
      const teams = await getTeams();
      if (teams.length > 0) {
        const firstTeam = teams[0];
        let resultText = `Testing stats for: ${firstTeam.market} ${firstTeam.name} (ID: ${firstTeam.id})\n\n`;
        
        const stats = await getTeamStats(firstTeam.id);
        resultText += `Stats Result:\n${JSON.stringify(stats, null, 2)}\n\n`;
        
        // Show what paths we're trying to access
        if (stats) {
          resultText += `Checking data paths:\n`;
          resultText += `stats.total?.games_played: ${stats.total?.games_played}\n`;
          resultText += `stats.own_record?.total?.wins: ${stats.own_record?.total?.wins}\n`;
          resultText += `stats.own_record?.total?.losses: ${stats.own_record?.total?.losses}\n`;
          resultText += `stats.own_record?.total?.ot_losses: ${stats.own_record?.total?.ot_losses}\n`;
          resultText += `stats.own_record?.total?.points: ${stats.own_record?.total?.points}\n\n`;
          
          // Show available keys
          resultText += `Available top-level keys: ${Object.keys(stats).join(', ')}\n`;
          if (stats.own_record) {
            resultText += `Available own_record keys: ${Object.keys(stats.own_record).join(', ')}\n`;
          }
          if (stats.total) {
            resultText += `Available total keys: ${Object.keys(stats.total).join(', ')}\n`;
          }
        }
        
        setResult(resultText);
      } else {
        setResult('No teams found to test stats');
      }
    } catch (error) {
      setResult(`Team Stats Error: ${error.message}\nDetails: ${JSON.stringify(error, null, 2)}`);
    }
    setLoading(false);
  };

  const testTeams = async () => {
    setLoading(true);
    try {
      const teams = await getTeams();
      setResult(`Teams Success: ${teams.length} teams\nTeams: ${JSON.stringify(teams, null, 2)}`);
    } catch (error) {
      setResult(`Teams Error: ${error.message}\nDetails: ${JSON.stringify(error, null, 2)}`);
    }
    setLoading(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Debug
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={testConnection} 
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test API Connection
        </Button>
        <Button 
          variant="contained" 
          onClick={testTeams} 
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test Get Teams
        </Button>
        <Button 
          variant="contained" 
          onClick={testTeamStats} 
          disabled={loading}
        >
          Test Team Stats
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Result:
      </Typography>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '16px', 
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '12px'
      }}>
        {result || 'Click a button to test...'}
      </pre>
    </Container>
  );
}

export default Debug;
