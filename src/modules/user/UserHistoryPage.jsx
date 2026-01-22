import { Alert, Divider, List, ListItem, ListItemText, Paper, Skeleton, Stack, Typography, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { listPackages, listTransactionsByCustomer } from './userApi';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

export default function UserHistoryPage() {
  const { me } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!me) return;
      setLoading(true);
      try {
        const [pkgs, trx] = await Promise.all([
          listPackages(),
          listTransactionsByCustomer(me.id)
        ]);
        const trxWithPkg = trx
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((t) => ({
            ...t,
            package: pkgs.find((p) => String(p.id) === String(t.packageId))
          }));
        setItems(trxWithPkg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [me]);

  if (!me) return <Alert severity="warning">Data akun tidak ditemukan. Silakan login ulang.</Alert>;

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={140} />
        <Skeleton variant="rectangular" height={140} />
      </Stack>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Riwayat Pembelian
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Belum ada transaksi.
        </Typography>
      ) : (
        <List disablePadding>
          {items.map((t, idx) => (
            <Stack key={t.id}>
              {idx !== 0 && <Divider />}
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {t.package?.name || 'Paket tidak ditemukan'}
                      </Typography>
                      <Chip size="small" variant="outlined" label={t.status || 'BERHASIL'} />
                    </Stack>
                  }
                  secondary={
                    <Stack sx={{ mt: 0.5 }} spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        {t.package?.quota || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Number(t.amount || t.package?.price || 0).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        })}{' '}
                        • {formatDate(t.date)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            </Stack>
          ))}
        </List>
      )}
    </Paper>
  );
}

