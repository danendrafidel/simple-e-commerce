import { Alert, Button, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { patchUser } from './userApi';

export default function UserProfilePage() {
  const { me, setMe } = useOutletContext();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });

  useEffect(() => {
    if (!me) return;
    setForm({
      name: me.name || '',
      phone: me.phone || '',
      email: me.email || '',
      address: me.address || ''
    });
  }, [me]);

  if (!me) return <Alert severity="warning">Data akun tidak ditemukan. Silakan login ulang.</Alert>;

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Profil
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Perbarui data profil kamu. Saldo tidak bisa diubah dari sini.
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Nomor HP"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
        />
        <TextField
          label="Alamat"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            disableElevation
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                const updated = await patchUser(me.id, {
                  name: form.name,
                  phone: form.phone,
                  email: form.email,
                  address: form.address
                });
                setMe(updated);
                setSnack({ open: true, message: 'Profil berhasil diperbarui.' });
              } catch {
                setSnack({ open: true, message: 'Gagal menyimpan profil.' });
              } finally {
                setSaving(false);
              }
            }}
          >
            Simpan
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        message={snack.message}
      />
    </Paper>
  );
}

