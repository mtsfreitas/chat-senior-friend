import { Typography, Box } from '@mui/material';

export const detectLanguage = (code) => {
  if (code.includes('import ') && code.includes('from ')) return 'javascript';
  if (code.includes('def ') || code.includes('class ')) return 'python';
  if (code.includes('public class ') || code.includes('System.out.println')) return 'java';
  if (code.includes('#include ') || code.includes('using namespace')) return 'cpp';
  if (code.includes('function ') || code.includes('<?php')) return 'php';
  if (code.includes('console.log')) return 'javascript';
  if (code.includes('const ') || code.includes('let ')) return 'typescript';
  return 'plaintext';
};

export const formatText = (text) => {
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
