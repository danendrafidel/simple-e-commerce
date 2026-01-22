import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';

export default function TransactionPage() {
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [note, setNote] = useState('');

  const steps = ['Pilih Customer', 'Pilih Paket Data', 'Konfirmasi'];

  const activeStep =
    !selectedCustomer ? 0 : !selectedPackage ? 1 : 2;

  useEffect(() => {
    const fetchAll = async () => {
      const [custRes, pkgRes, trxRes] = await Promise.all([
        axios.get('http://localhost:3000/users', { params: { role: 'customer' } }),
        axios.get('http://localhost:3000/packages'),
        axios.get('http://localhost:3000/transactions')
      ]);
      const customersData = custRes.data;
      const packagesData = pkgRes.data;
      const trxWithDetail = trxRes.data.map((t) => ({
        ...t,
        customer: customersData.find((c) => String(c.id) === String(t.customerId)),
        package: packagesData.find((p) => String(p.id) === String(t.packageId))
      }));
      setCustomers(customersData);
      setPackages(packagesData);
      setTransactions(trxWithDetail);
    };
    fetchAll();
  }, []);

  const handleCreate = async () => {
    const pkg = packages.find((p) => String(p.id) === String(selectedPackage));
    const customer = customers.find((c) => String(c.id) === String(selectedCustomer));
    if (!pkg || !customer) return;

    const payload = {
      customerId: String(customer.id),
      packageId: String(pkg.id),
      amount: pkg.price,
      status: 'BERHASIL',
      note,
      date: new Date().toISOString()
    };

    try {
      await axios.patch(`http://localhost:3000/users/${customer.id}`, {
        balance: Number(customer.balance || 0) - Number(pkg.price || 0)
      });
    } catch {
      // jika gagal update saldo, lanjut saja
    }

    const res = await axios.post('http://localhost:3000/transactions', payload);
    const { data: customerData } = await axios.get(
      `http://localhost:3000/users/${customer.id}`
    );
    const { data: packageData } = await axios.get(
      `http://localhost:3000/packages/${pkg.id}`
    );

    setTransactions((prev) => [
      {
        ...res.data,
        customer: customerData,
        package: packageData
      },
      ...prev
    ]);
    setSelectedCustomer('');
    setSelectedPackage('');
    setNote('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Batalkan/hapus transaksi ini?')) return;
    await axios.delete(`http://localhost:3000/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Transaksi Pembelian Paket Data</Typography>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3 }}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  labelId="customer-label"
                  label="Customer"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {customers.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!selectedCustomer}>
                <InputLabel id="package-label">Paket Data</InputLabel>
                <Select
                  labelId="package-label"
                  label="Paket Data"
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                >
                  {packages.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} - {p.quota} (
                      {p.price.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      })}
                      )
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Catatan (opsional)"
                fullWidth
                multiline
                minRows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <Box textAlign="right">
                <Button
                  variant="contained"
                  disabled={!selectedCustomer || !selectedPackage}
                  onClick={handleCreate}
                >
                  Proses Pembelian
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6">Daftar Transaksi</Typography>
      {transactions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Belum ada transaksi.
        </Typography>
      )}
      <Stack spacing={1}>
        {transactions.map((t) => (
          <Card key={t.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1">
                    {t.customer?.name || 'Customer tidak ditemukan'} membeli{' '}
                    {t.package?.name || 'Paket tidak ditemukan'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.package?.quota || '-'} -{' '}
                    {Number(t.amount || t.package?.price || 0).toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {t.status || 'BERHASIL'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tanggal: {new Date(t.date).toLocaleString('id-ID')}
                  </Typography>
                  {t.note && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Catatan: {t.note}
                    </Typography>
                  )}
                </Box>
                <IconButton color="error" onClick={() => handleDelete(t.id)}>
                  <Delete />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
