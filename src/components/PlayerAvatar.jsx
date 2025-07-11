import React from 'react';
import { Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

const getPlayerPhotoUrl = (playerId, teamAlias) => {
  if (!playerId) return null;
  
  const season = '20242025';
  const team = teamAlias ? teamAlias.toUpperCase() : 'NHL';
  
  return `https://assets.nhle.com/mugs/nhl/${season}/${team}/${playerId}.png`;
};

const PlayerAvatar = ({ player, size = 40, showFallback = true }) => {
  const photoUrl = getPlayerPhotoUrl(player.id, player.team?.alias);
  
  return (
    <Avatar
      sx={{
        bgcolor: showFallback ? 'secondary.main' : 'transparent',
        width: size,
        height: size,
        fontSize: size < 40 ? '0.9rem' : '1.2rem',
        border: showFallback ? '2px solid #f0f0f0' : 'none',
      }}
      src={photoUrl}
      alt={`${player.full_name || `${player.first_name} ${player.last_name}`} photo`}
    >
      {showFallback && <Person />}
    </Avatar>
  );
};

export default PlayerAvatar;
