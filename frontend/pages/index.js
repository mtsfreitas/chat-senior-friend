import { Box } from '@mui/material';
import CodeAnalyzer from '../components/CodeAnalyzer';

export default function Home() {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5', 
      p: 2 
    }}>
      <CodeAnalyzer />
    </Box>
  );
}