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
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
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
        <Typography 
          variant="h4" 
          mb={2} 
          align="center" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'Consolas, monospace',  // Fonte Consolas
            fontWeight: 'bold'  // Caso queira um peso de fonte mais forte
          }}
        >
          <img src="code-logo.svg" alt="Code Icon" style={{ width: '45px', height: '45px', marginRight: '15px' }} />
          Senior Friend
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            placeholder="Paste your code here..."
            value={code}
            onChange={handleCodeChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Previne a ação padrão de adicionar uma nova linha
                handleSubmit(); // Chama a função para enviar o código
              }
            }}
            sx={{
              mb: 2,
              bgcolor: 'rgb(244, 244, 244)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                padding: '25px',
                fontSize: '16px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                '& fieldset': {
                  borderColor: '#848484', // Define a cor da borda para verde
                },
                '&:hover fieldset': {
                  borderColor: '#848484', // Borda verde quando passa o mouse sobre o campo
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#848484', // Borda verde quando o campo está em foco
                },
              },
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
                  backgroundColor: '#333333',
                  '& img': {
                    filter: 'invert(100%) sepia(0%) saturate(0%)'
                  },
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : <img src="/wizard.svg" alt="Send" style={{ width: '20px', height: '20px' }} />}
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img src="ai.svg" alt="AI Icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          <Typography variant="body2" color="textSecondary">gpt-4o-mini</Typography>
        </Box>

        {error && (
          <Typography color="error" mb={2} align="center">
            {error}
          </Typography>
        )}

        {result && (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="message-balloon-ai.svg" alt="Explanation Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <Typography variant="h6">Natural Language Explanation</Typography>
              </Box>
              {formatText(result.naturalLanguageExplanation)}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 2, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="code-ai.svg" alt="Code Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <Typography variant="h6">Refactored Code</Typography>
              </Box>
              
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src="brain-ai.svg" alt="Reasoning Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <Typography variant="h6">Step-by-Step Reasoning</Typography>
              </Box>
              {formatText(result.stepByStepReasoning)}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
}