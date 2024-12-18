import { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

// Function to format text with proper line breaks for numbered lists
const formatText = (text) => {
  // Split the text into lines
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    // Check if the line starts with a number followed by a period
    const numberListMatch = line.match(/^(\d+\.\s*)(.+)$/);
    
    if (numberListMatch) {
      return (
        <Box key={index} sx={{ pl: 2, textIndent: '-1.5em', mb: 1 }}>
          <Typography>{line}</Typography>
        </Box>
      );
    }
    
    // Return regular text as is
    return <Typography key={index}>{line}</Typography>;
  });
};

export default function Home() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3001/analyze-code', { code });
      setResult(response.data);
    } catch (err) {
      console.error('Full Error:', err);
      setError('Failed to analyze the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Code Snippet Refactoring Tool</Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!code || loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze Code'}
      </Button>
      
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      
      {result && (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Natural Language Explanation</Typography>
            {formatText(result.naturalLanguageExplanation)}
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Refactored Code</Typography>
            <Box 
              component="pre" 
              sx={{ 
                bgcolor: '#f4f4f4', 
                p: 2, 
                borderRadius: 1, 
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                border: '1px solid #ddd',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              {result.refactoredCode}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Step-by-Step Reasoning</Typography>
            {formatText(result.stepByStepReasoning)}
          </Paper>
        </Box>
      )}
    </Box>
  );
}