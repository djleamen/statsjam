import React, { useState, useEffect } from 'react';
import { getTeams } from '../api/nhl';

function SimpleTest() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SimpleTest: Starting fetch');
    getTeams()
      .then(data => {
        console.log('SimpleTest: Got data', data);
        setTeams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('SimpleTest: Error', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test</h1>
      <p>Teams count: {teams.length}</p>
      <ul>
        {teams.slice(0, 5).map(team => (
          <li key={team.id}>{team.market} {team.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SimpleTest;
