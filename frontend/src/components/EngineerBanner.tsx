import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { tokens } from '../theme';

export const EngineerBanner: React.FC = () => {
  return (
    <Tooltip
      title="All engineering values, design rules, curve limits and unit rates are placeholders to be confirmed by a registered engineer."
      placement="bottom"
    >
      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: 'rgba(227,169,72,0.06)',
          borderBottom: `1px solid rgba(227,169,72,0.18)`,
          height: 30,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <VerifiedUserOutlinedIcon sx={{ color: tokens.warning, fontSize: '0.875rem' }} />
        <Typography
          sx={{
            color: '#D8B876',
            fontWeight: 500,
            fontSize: '0.6875rem',
            letterSpacing: '0.055em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Preliminary output · to be confirmed by a registered engineer
        </Typography>
      </Box>
    </Tooltip>
  );
};
