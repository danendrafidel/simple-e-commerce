import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getCurrentCustomerUser } from './userApi';

function tabFromPath(pathname) {
  if (pathname.startsWith('/user/history')) return 1;
  if (pathname.startsWith('/user/profile')) return 2;
  return 0;
}

export default function UserLayout() {
  const { user, ready, logout } = useAuth();
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const tabValue = useMemo(() => tabFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== 'customer') return;
    getCurrentCustomerUser(user.id).then(setMe).catch(() => setMe(null));
  }, [ready, user]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = me?.name || user?.username || 'Customer';
  const balanceLabel = me
    ? Number(me.balance || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
    : '-';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #1a73e8 0%, #42a5f5 100%)',
          color: '#fff'
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: '#fff', color: 'primary.main' }}>
                {displayName.slice(0, 1).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  Portal Paket Data
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {displayName}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                variant="filled"
                color="default"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                label={`Saldo ${balanceLabel}`}
              />
              <Button color="inherit" onClick={handleLogout}>
                Keluar
              </Button>
            </Stack>
          </Stack>
          <Tabs
            value={tabValue}
            onChange={(_, v) => {
              if (v === 0) navigate('/user/purchase');
              if (v === 1) navigate('/user/history');
              if (v === 2) navigate('/user/profile');
            }}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.9)' },
              '& .Mui-selected': { color: '#fff', fontWeight: 600 }
            }}
          >
            <Tab label="Beli Paket" />
            <Tab label="Riwayat" />
            <Tab label="Profil" />
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Outlet context={{ me, setMe }} />
      </Container>
    </Box>
  );
}

