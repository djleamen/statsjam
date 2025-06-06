// src/components/TeamLogo.jsx
import React from 'react';
import { Avatar } from '@mui/material';

// Team logo URLs - using ESPN's reliable CDN
const getTeamLogoUrl = (teamAlias) => {
  if (!teamAlias) return null;
  
  // Convert team alias to lowercase for consistent URL formatting
  const alias = teamAlias.toLowerCase();
  
  // ESPN uses these logo URLs with good reliability
  return `https://a.espncdn.com/i/teamlogos/nhl/500/${alias}.png`;
};

// Team colors mapping for better visual presentation
const teamColors = {
  'ANA': '#F47A38',
  'ARI': '#8C2633',
  'BOS': '#FFB81C',
  'BUF': '#003087',
  'CGY': '#C8102E',
  'CAR': '#CC0000',
  'CHI': '#CF0A2C',
  'COL': '#6F263D',
  'CBJ': '#002654',
  'DAL': '#006847',
  'DET': '#CE1126',
  'EDM': '#041E42',
  'FLA': '#041E42',
  'LAK': '#111111',
  'MIN': '#154734',
  'MTL': '#AF1E2D',
  'NSH': '#FFB81C',
  'NJD': '#CE1126',
  'NYI': '#00539B',
  'NYR': '#0038A8',
  'OTT': '#C52032',
  'PHI': '#F74902',
  'PIT': '#FCB514',
  'SJS': '#006D75',
  'SEA': '#99D9D9',
  'STL': '#002F87',
  'TBL': '#002868',
  'TOR': '#003E7E',
  'VAN': '#00205B',
  'VGK': '#B4975A',
  'WSH': '#C8102E',
  'WPG': '#041E42'
};

const TeamLogo = ({ team, size = 70, showFallback = true }) => {
  const logoUrl = getTeamLogoUrl(team.alias);
  const teamColor = teamColors[team.alias] || '#1976d2';
  
  return (
    <Avatar
      sx={{
        bgcolor: showFallback ? 'rgba(255,255,255,0.9)' : 'transparent',
        width: size,
        height: size,
        fontSize: size < 50 ? '1rem' : '1.5rem',
        fontWeight: 'bold',
        color: teamColor,
        border: showFallback ? `2px solid ${teamColor}` : 'none',
      }}
      src={logoUrl}
      alt={`${team.market} ${team.name} logo`}
    >
      {/* Fallback to team alias if logo fails to load */}
      {showFallback && team.alias}
    </Avatar>
  );
};

export default TeamLogo;
