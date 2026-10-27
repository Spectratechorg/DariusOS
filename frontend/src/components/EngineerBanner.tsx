import React from 'react';
import { Box, Typography } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

export const EngineerBanner: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1E1512',
        borderBottom: '1px solid #78350F',
        py: 0.5,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
      }}
    >
      <VerifiedUserOutlinedIcon sx={{ color: '#F59E0B', fontSize: '0.95rem' }} />
      <Typography
        variant="caption"
        sx={{
          color: '#FDE68A',
          fontWeight: 600,
          letterSpacing: '0.03em',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
        }}
      >
        TO BE CONFIRMED BY A REGISTERED ENGINEER · ALL GEOMETRY, VOLUMES, AND RATES ARE PRELIMINARY PLACEHOLDERS
      </Typography>
    </Box>
  );
};
