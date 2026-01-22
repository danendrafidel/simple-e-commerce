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
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/packages';

const emptyPackage = {
  name: '',
  quota: '',
  price: ''
};

export default function PackageListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyPackage);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setForm(emptyPackage);
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      quota: item.quota,
      price: item.price
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk kuota ini?')) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchItems();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      quota: form.quota,
      price: Number(form.price)
    };
    if (editingItem) {
      await axios.put(`${API_URL}/${editingItem.id}`, {
        ...editingItem,
        ...payload
      });
    } else {
      await axios.post(API_URL, payload);
    }
    setOpenForm(false);
    fetchItems();
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
        <Typography variant="h5">Produk Kuota</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Tambah Produk
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Paket</TableCell>
              <TableCell>Kuota / Masa Aktif</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.quota}</TableCell>
                <TableCell>
                  {Number(p.price).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  })}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEdit(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Belum ada produk kuota.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingItem ? 'Edit Produk Kuota' : 'Tambah Produk Kuota'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              label="Nama Paket"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TextField
              label="Kuota / Masa Aktif"
              fullWidth
              margin="normal"
              value={form.quota}
              onChange={(e) => setForm({ ...form, quota: e.target.value })}
              required
            />
            <TextField
              label="Harga"
              type="number"
              fullWidth
              margin="normal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

