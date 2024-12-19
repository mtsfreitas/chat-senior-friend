import { Box, Typography } from '@mui/material';

export default function IconWithLabel({ icon, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img src={icon} alt={`${label} Icon`} style={{ width: '20px', height: '20px', marginRight: '8px' }} />
      <Typography variant="body2" color="textSecondary">{label}</Typography>
    </Box>
  );
}