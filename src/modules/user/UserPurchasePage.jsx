import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { createTopup, createTransaction, listPackages, patchUser } from './userApi';

export default function UserPurchasePage() {
  const { me, setMe } = useOutletContext();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [confirmBuy, setConfirmBuy] = useState({ open: false, pkg: null });
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupValue, setTopupValue] = useState(50000);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const pkgs = await listPackages();
        setPackages(pkgs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const balance = useMemo(() => Number(me?.balance || 0), [me]);

  if (!me) {
    return <Alert severity="warning">Data akun tidak ditemukan. Silakan login ulang.</Alert>;
  }

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={120} />
        <Skeleton variant="rectangular" height={120} />
        <Skeleton variant="rectangular" height={120} />
      </Stack>
    );
  }

  const doTopup = async (amount) => {
    const newBalance = balance + amount;
    try {
      const updated = await patchUser(me.id, { balance: newBalance });
      await createTopup({ customerId: String(me.id), amount, date: new Date().toISOString() });
      setMe(updated);
      setSnack({ open: true, message: 'Top up berhasil.', severity: 'success' });
      setTopupOpen(false);
    } catch {
      setSnack({ open: true, message: 'Top up gagal. Coba lagi.', severity: 'error' });
    }
  };

  const doBuy = async (pkg) => {
    const price = Number(pkg.price || 0);
    if (balance < price) {
      setSnack({ open: true, message: 'Saldo tidak mencukupi. Silakan top up.', severity: 'warning' });
      return;
    }
    const newBalance = balance - price;
    try {
      const updated = await patchUser(me.id, { balance: newBalance });
      await createTransaction({
        customerId: String(me.id),
        packageId: String(pkg.id),
        amount: price,
        status: 'BERHASIL',
        date: new Date().toISOString()
      });
      setMe(updated);
      setSnack({ open: true, message: 'Pembelian berhasil.', severity: 'success' });
    } catch {
      setSnack({ open: true, message: 'Pembelian gagal. Coba lagi.', severity: 'error' });
    }
  };

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <BoxBalance balance={balance} />
          <Button variant="contained" disableElevation onClick={() => setTopupOpen(true)}>
            Top up
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Paket Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Klik “Beli” untuk melanjutkan. Akan muncul konfirmasi (iya/tidak).
        </Typography>

        <Stack spacing={1.5}>
          {packages.map((p) => {
            const price = Number(p.price || 0);
            const ok = balance >= price;
            return (
              <Paper
                key={p.id}
                variant="outlined"
                sx={{
                  p: 2,
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                  '&:hover': { boxShadow: 2, transform: 'translateY(-2px)' }
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.quota}
                    </Typography>
                    <Typography variant="body2">
                      {price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </Typography>
                  </Stack>
                  <Stack alignItems={{ xs: 'stretch', sm: 'flex-end' }} spacing={1}>
                    {!ok && <Chip size="small" variant="outlined" label="Saldo kurang" />}
                    <Button
                      variant="contained"
                      disableElevation
                      disabled={!ok}
                      onClick={() => setConfirmBuy({ open: true, pkg: p })}
                    >
                      Beli
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Paper>

      <Dialog open={topupOpen} onClose={() => setTopupOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Top Up Saldo</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pilih nominal top up.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {[10000, 25000, 50000, 100000, 250000].map((v) => (
              <Chip
                key={v}
                clickable
                variant={topupValue === v ? 'filled' : 'outlined'}
                color={topupValue === v ? 'primary' : 'default'}
                label={`+${v.toLocaleString('id-ID')}`}
                onClick={() => setTopupValue(v)}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopupOpen(false)}>Batal</Button>
          <Button variant="contained" disableElevation onClick={() => doTopup(topupValue)}>
            Top up
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmBuy.open}
        onClose={() => setConfirmBuy({ open: false, pkg: null })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Konfirmasi Pembelian</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Yakin membeli <b>{confirmBuy.pkg?.name}</b>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Harga:{' '}
            {Number(confirmBuy.pkg?.price || 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR'
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Saldo setelah beli:{' '}
            {Number(balance - Number(confirmBuy.pkg?.price || 0)).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR'
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBuy({ open: false, pkg: null })}>Tidak</Button>
          <Button
            variant="contained"
            disableElevation
            onClick={async () => {
              const pkg = confirmBuy.pkg;
              setConfirmBuy({ open: false, pkg: null });
              if (pkg) await doBuy(pkg);
            }}
          >
            Iya, beli
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        message={snack.message}
      />
    </Stack>
  );
}

function BoxBalance({ balance }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" color="text.secondary">
        Saldo
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {Number(balance || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
      </Typography>
    </Stack>
  );
}

