import { useState } from 'react';
import { TextField, Button, CircularProgress, Typography, Box } from '@mui/material';
import axios from 'axios';

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
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      {result && (
        <Box>
          <Typography variant="h6">Explanation:</Typography>
          <Typography>{result.explanation}</Typography>
        </Box>
      )}
    </Box>
  );
}
