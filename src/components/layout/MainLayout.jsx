import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

export default function MainLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Paket Data
          </Typography>
          <Button
            color={isActive('/customers') ? 'secondary' : 'inherit'}
            component={RouterLink}
            to="/customers"
          >
            Customer
          </Button>
          <Button
            color={isActive('/transactions') ? 'secondary' : 'inherit'}
            component={RouterLink}
            to="/transactions"
          >
            Transaksi
          </Button>
          <Button
            color={isActive('/packages') ? 'secondary' : 'inherit'}
            component={RouterLink}
            to="/packages"
          >
            Produk Kuota
          </Button>
          <Typography variant="body2" sx={{ mx: 2 }}>
            {user?.username}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

