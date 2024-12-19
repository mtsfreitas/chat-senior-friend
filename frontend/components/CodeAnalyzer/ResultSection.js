import { Paper, Typography, Box, IconButton } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from 'react';
import { detectLanguage, formatText } from '../../utils/codeUtils';


export default function ResultSection({ result }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (result?.refactoredCode) {
      navigator.clipboard.writeText(result.refactoredCode).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      });
    }
  };

  if (!result) return null;

  return (
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
          language={detectLanguage(result.refactoredCode) || 'python'}
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
  );
}