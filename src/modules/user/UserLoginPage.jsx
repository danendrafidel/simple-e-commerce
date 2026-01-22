import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserLoginPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/customers', {
        params: { phone }
      });
      if (res.data.length === 0) {
        setError('Nomor belum terdaftar sebagai customer.');
      } else {
        const customer = res.data[0];
        localStorage.setItem('customerSession', JSON.stringify(customer));
        navigate('/user', { replace: true });
      }
    } catch (err) {
      setError('Gagal menghubungi server. Pastikan json-server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          Login Customer
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Masukkan nomor HP yang sudah terdaftar untuk membeli paket data.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nomor HP"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

