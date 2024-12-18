import { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Box, Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import axios from 'axios';

// Function to detect programming language
const detectLanguage = (code) => {
  if (code.includes('import ') && code.includes('from ')) return 'javascript';
  if (code.includes('def ') || code.includes('class ')) return 'python';
  if (code.includes('public class ') || code.includes('System.out.println')) return 'java';
  if (code.includes('#include ') || code.includes('using namespace')) return 'cpp';
  if (code.includes('function ') || code.includes('<?php')) return 'php';
  if (code.includes('console.log')) return 'javascript';
  if (code.includes('const ') || code.includes('let ')) return 'typescript';
  return 'plaintext';
};

// Function to format text with proper line breaks for numbered lists
const formatText = (text) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const numberListMatch = line.match(/^(\d+\.\s*)(.+)$/);
    if (numberListMatch) {
      return (
        <Box key={index} sx={{ pl: 2, textIndent: '-1.5em', mb: 1 }}>
          <Typography>{line}</Typography>
        </Box>
      );
    }
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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
      <Box sx={{ maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" mb={2} align="center">Code Snippet Refactoring Tool</Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ 
            mb: 2, 
            bgcolor: 'rgb(244, 244, 244)', 
            borderRadius: '8px', 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!code || loading}
          sx={{ mb: 2, display: 'block', margin: '0 auto' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Code'}
        </Button>

        {error && (
          <Typography color="error" mb={2} align="center">
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
              <SyntaxHighlighter 
                language={detectLanguage(result.refactoredCode)}
                style={dracula}
                customStyle={{ 
                  borderRadius: '4px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  fontSize: '0.875rem'
                }}
                showLineNumbers
              >
                {result.refactoredCode}
              </SyntaxHighlighter>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Step-by-Step Reasoning</Typography>
              {formatText(result.stepByStepReasoning)}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}
