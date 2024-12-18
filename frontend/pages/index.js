import { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Box, Paper, IconButton } from '@mui/material';
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
  const [rows, setRows] = useState(2);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCodeChange = (e) => {
    const newValue = e.target.value;
    setCode(newValue);

    if (newValue.trim() === '') {
      setRows(2);
      return;
    }

    const textareaLineHeight = 24;
    const { scrollHeight } = e.target;
    
    const currentRows = Math.min(
      Math.max(Math.ceil(scrollHeight / textareaLineHeight), 2), 
      6
    );

    setRows(currentRows);
  };

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

  const handleCopyCode = () => {
    if (result && result.refactoredCode) {
      navigator.clipboard.writeText(result.refactoredCode).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
      <Box sx={{ maxWidth: '800px', width: '100%' }}>
        <Typography variant="h4" mb={2} align="center">Code Snippet Refactoring Tool</Typography>
        
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            rows={rows}
            variant="outlined"
            placeholder="Paste your code here..."
            value={code}
            onChange={handleCodeChange}
            sx={{ 
              mb: 2, 
              bgcolor: 'rgb(244, 244, 244)', 
              borderRadius: '8px', 
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />

          {code && (
            <Button
              variant="contained"
              color="default"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                position: 'absolute',
                right: '10px',
                bottom: '-30px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                color: 'primary.main',
                border: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : <img src="/send.svg" alt="Send" style={{ width: '20px', height: '20px' }} />}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img src="ai.svg" alt="AI Icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          <Typography variant="body2" color="textSecondary">model: 'gpt-4o-mini'</Typography>
        </Box>

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

            <Paper elevation={3} sx={{ p: 3, mb: 2, position: 'relative' }}>
              <Typography variant="h6" gutterBottom>Refactored Code</Typography>
              
              {/* Botão de copiar no canto superior direito */}
              <IconButton 
                onClick={handleCopyCode}
                sx={{
                  position: 'absolute', 
                  top: 10, 
                  right: 10,
                  color: copiedCode ? 'green' : 'gray'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </IconButton>

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