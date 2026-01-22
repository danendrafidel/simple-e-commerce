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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/users', {
        params: { username, password }
      });
      if (res.data.length === 0) {
        setError('Username atau password salah');
      } else {
        const user = res.data[0];
        login(user);
        if (user.role === 'customer') {
          navigate('/user', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      setError('Gagal login, periksa koneksi API (json-server).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          {isRegister ? 'Daftar Akun Customer' : 'Login E-Commerce Paket Data'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {isRegister
            ? 'Buat akun baru untuk membeli paket data.'
            : 'Halo, silakan login untuk mengakses halaman.'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {!isRegister ? (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setLoading(true);
              try {
                // cek username sudah dipakai atau belum
                const exists = await axios.get('http://localhost:3000/users', {
                  params: { username }
                });
                if (exists.data.length > 0) {
                  setError('Username sudah digunakan, silakan pilih yang lain.');
                } else {
                  const userRes = await axios.post('http://localhost:3000/users', {
                    username,
                    password,
                    role: 'customer',
                    name,
                    phone,
                    email,
                    address,
                    balance: 0
                  });
                  const newUser = userRes.data;
                  login(newUser);
                  navigate('/user', { replace: true });
                }
              } catch (err) {
                setError('Gagal mendaftar. Pastikan server API berjalan.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <TextField
              label="Nama Lengkap"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Nomor HP"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Alamat"
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Memproses...' : 'Daftar & Masuk'}
            </Button>
          </Box>
        )}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            color="secondary"
            size="small"
            onClick={() => {
              setError('');
              setIsRegister(!isRegister);
            }}
          >
            {isRegister
              ? 'Sudah punya akun? Login di sini'
              : 'Belum punya akun? Daftar sebagai customer'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

