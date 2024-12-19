import { useState } from 'react';
import { TextField, Button, CircularProgress, Box } from '@mui/material';

export default function CodeInput({ onSubmit }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
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
              borderColor: '#848484',
            },
            '&:hover fieldset': {
              borderColor: '#848484',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#848484',
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
  );
}