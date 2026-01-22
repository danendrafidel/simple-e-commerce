import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/users';

const emptyCustomer = {
  name: '',
  phone: '',
  email: '',
  address: '',
  balance: 0
};

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(emptyCustomer);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, { params: { role: 'customer' } });
      setCustomers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setForm(emptyCustomer);
    setOpenForm(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      balance: Number(customer.balance || 0)
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    // sederhana: konfirmasi browser
    if (!window.confirm('Hapus customer ini?')) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchCustomers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerPayload = {
      ...form,
      role: 'customer',
      balance: Number(form.balance || 0)
    };
    if (editingCustomer) {
      const res = await axios.put(`${API_URL}/${editingCustomer.id}`, {
        ...editingCustomer,
        ...customerPayload
      });
    } else {
      await axios.post(API_URL, customerPayload);
    }

    setOpenForm(false);
    fetchCustomers();
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h5">Daftar Customer</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Tambah Customer
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Telepon</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/customers/${c.id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenEdit(c)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(c.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Belum ada data customer
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCustomer ? 'Edit Customer' : 'Tambah Customer'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Nama"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TextField
              label="Telepon"
              fullWidth
              margin="normal"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Alamat"
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <TextField
              label="Saldo (IDR)"
              type="number"
              fullWidth
              margin="normal"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Batal</Button>
            <Button type="submit" variant="contained">
              Simpan
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

