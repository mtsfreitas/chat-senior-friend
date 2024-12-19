import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import axios from 'axios';
import CodeInput from './CodeInput';
import ResultSection from './ResultSection';
import IconWithLabel from '../ui/IconWithLabel';

export default function CodeAnalyzer() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (code) => {
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3001/analyze-code', { code });
      setResult(response.data);
    } catch (err) {
      console.error('Full Error:', err);
      setError('Failed to analyze the code. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', width: '100%' }}>
      <Typography 
        variant="h4" 
        mb={2} 
        align="center" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: 'Consolas, monospace',  
          fontWeight: 'bold'  
        }}
      >
        <img src="code-logo.svg" alt="Code Icon" style={{ width: '45px', height: '45px', marginRight: '15px' }} />
        Senior Friend
      </Typography>

      <CodeInput onSubmit={handleSubmit} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconWithLabel icon="ai.svg" label="gpt-4o-mini" />
      </Box>

      {error && (
        <Typography color="error" mb={2} align="center">
          {error}
        </Typography>
      )}

      <ResultSection result={result} />
    </Box>
  );
}