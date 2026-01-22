import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [custRes, trxRes, pkgRes] = await Promise.all([
        axios.get(`http://localhost:3000/users/${id}`),
        axios.get('http://localhost:3000/transactions', {
          params: { customerId: id }
        }),
        axios.get('http://localhost:3000/packages')
      ]);
      const packagesData = pkgRes.data;
      setCustomer(custRes.data);
      setTransactions(
        trxRes.data.map((t) => ({
          ...t,
          package: packagesData.find((p) => String(p.id) === String(t.packageId))
        }))
      );
    };
    fetchData();
  }, [id]);

  if (!customer) return <Typography>Memuat...</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Detail Customer</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">{customer.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {customer.phone} • {customer.email}
          </Typography>
          <Typography sx={{ mt: 1 }}>{customer.address}</Typography>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            Saldo: {Number(customer.balance || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6">Riwayat Pembelian Paket Data</Typography>
      {transactions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Belum ada transaksi.
        </Typography>
      )}
      <Stack spacing={1}>
        {transactions.map((t) => (
          <Card key={t.id}>
            <CardContent>
              <Typography variant="subtitle1">
                {t.package?.name} - {t.package?.quota} ({t.package?.price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tanggal: {new Date(t.date).toLocaleString('id-ID')}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Chip
                label={t.status}
                color={t.status === 'BERHASIL' ? 'success' : 'warning'}
                size="small"
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

