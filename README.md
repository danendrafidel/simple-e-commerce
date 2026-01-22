# Simple E-Commerce Paket Data

Aplikasi e-commerce sederhana untuk penjualan paket data (kuota internet). Aplikasi ini dibangun dengan React.js dan Vite sebagai development server, serta Material-UI untuk UI components. Aplikasi menggunakan JSON Server sebagai mock backend API.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Proyek](#struktur-proyek)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Kredensial Login](#kredensial-login)
- [API Endpoints](#api-endpoints)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Kontribusi](#kontribusi)

## 🎯 Fitur Utama

### Untuk Admin

- 👥 **Manajemen Pelanggan**: Lihat daftar pelanggan dan detail informasi mereka
- 📦 **Kelola Paket**: Lihat dan atur paket data yang tersedia
- 💳 **Manajemen Transaksi**: Pantau semua transaksi penjualan
- 📊 **Dashboard Admin**: Akses ke semua fitur manajemen

### Untuk Customer

- 🛍️ **Belanja Paket Data**: Lihat dan beli berbagai paket data yang tersedia
- 💰 **Manajemen Saldo**: Kelola saldo akun
- 📜 **Riwayat Pembelian**: Lihat history semua transaksi yang telah dilakukan
- 👤 **Profil User**: Kelola informasi personal (nama, email, telepon, alamat)

## 🛠️ Teknologi yang Digunakan

| Teknologi             | Versi        | Kegunaan                    |
| --------------------- | ------------ | --------------------------- |
| **React**             | 18.3.1       | Frontend Framework          |
| **React Router**      | 6.28.0       | Routing dan Navigation      |
| **Vite**              | 6.0.0        | Build tool dan Dev Server   |
| **Material-UI (MUI)** | 6.1.0        | UI Component Library        |
| **Axios**             | 1.7.0        | HTTP Client untuk API calls |
| **Emotion**           | 11.13.0      | CSS-in-JS Solution          |
| **JSON Server**       | 1.0.0-beta.3 | Mock REST API Server        |
| **SWC**               | 3.7.0        | Fast JavaScript Compiler    |

## 📦 Persyaratan Sistem

- **Node.js**: Versi 14.0 atau lebih tinggi
- **npm** atau **yarn**: Package manager
- **Port Tersedia**:
  - Port 5173 untuk Vite dev server
  - Port 3000 untuk JSON Server

## 📥 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/danendrafidel/simple-e-commerce.git
cd simple-e-commerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verifikasi Instalasi

```bash
npm run dev --version
npm list react react-router-dom @mui/material
```

## ▶️ Cara Menjalankan

### Mode Development

Jalankan aplikasi dalam 2 terminal terpisah:

**Terminal 1 - Jalankan JSON Server (Backend Mock):**

```bash
npm run server
```

Server akan berjalan di `http://localhost:3000`

**Terminal 2 - Jalankan Vite Dev Server (Frontend):**

```bash
npm run dev
```

Aplikasi akan terbuka di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

File hasil build akan tersimpan di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📁 Struktur Proyek

```
simple-e-commerce/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── MainLayout.jsx          # Layout utama untuk admin
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── AuthContext.jsx         # Context untuk autentikasi
│   │   │   └── LoginPage.jsx           # Halaman login
│   │   ├── customers/
│   │   │   ├── CustomerListPage.jsx    # Daftar pelanggan (admin)
│   │   │   └── CustomerDetailPage.jsx  # Detail pelanggan (admin)
│   │   ├── packages/
│   │   │   └── PackageListPage.jsx     # Daftar paket (admin & customer)
│   │   ├── transactions/
│   │   │   └── TransactionPage.jsx     # Manajemen transaksi (admin)
│   │   └── user/
│   │       ├── UserLayout.jsx          # Layout untuk customer
│   │       ├── UserLoginPage.jsx       # Halaman login customer
│   │       ├── UserProfilePage.jsx     # Profil customer
│   │       ├── UserPurchasePage.jsx    # Halaman pembelian paket
│   │       ├── UserHistoryPage.jsx     # Riwayat pembelian
│   │       └── userApi.js              # API calls untuk customer
│   ├── App.jsx                          # Root component dengan routing
│   ├── main.jsx                         # Entry point aplikasi
├── db.json                              # Database mock JSON
├── index.html                           # HTML template
├── package.json                         # Project dependencies
├── vite.config.js                       # Konfigurasi Vite
└── README.md                            # File dokumentasi ini
```

## 🎨 Fitur Aplikasi

### 1. **Autentikasi & Otorisasi**

- Login dengan username dan password
- Dua role: `admin` dan `customer`
- Protected routes berdasarkan role user
- Session management menggunakan React Context

### 2. **Admin Dashboard**

- **Customers**: Lihat daftar semua pelanggan dengan detail informasi
- **Packages**: Kelola daftar paket data yang tersedia
- **Transactions**: Pantau riwayat semua transaksi dalam sistem
- Navigation menu untuk akses mudah

### 3. **Customer Portal**

- **Purchase**: Belanja dan beli paket data
- **History**: Lihat riwayat pembelian dan transaksi
- **Profile**: Update informasi personal (nama, email, telepon, alamat)

### 4. **Data Management**

- Penyimpanan data menggunakan JSON Server
- Support untuk CRUD operations (Create, Read, Update, Delete)
- Real-time data fetching menggunakan Axios

## 🔐 Kredensial Login

### Admin Account

- **Username**: `admin`
- **Password**: `admin123`

### Customer Accounts

| Username | Password | Name  | Role     |
| -------- | -------- | ----- | -------- |
| admin    | admin123 | Admin | admin    |
| john     | john123  | John  | customer |
| budi     | budi123  | Budi  | customer |

## 🔌 API Endpoints

JSON Server menyediakan RESTful API endpoints berikut:

### Users

- `GET /users` - Dapatkan semua users
- `GET /users/:id` - Dapatkan user berdasarkan ID
- `POST /users` - Buat user baru
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Hapus user

### Packages

- `GET /packages` - Dapatkan semua paket
- `GET /packages/:id` - Dapatkan paket berdasarkan ID
- `POST /packages` - Buat paket baru
- `PUT /packages/:id` - Update paket
- `DELETE /packages/:id` - Hapus paket

### Transactions

- `GET /transactions` - Dapatkan semua transaksi
- `GET /transactions/:id` - Dapatkan transaksi berdasarkan ID
- `POST /transactions` - Buat transaksi baru
- `PUT /transactions/:id` - Update transaksi
- `DELETE /transactions/:id` - Hapus transaksi

**Base URL**: `http://localhost:3000`

Contoh request:

```bash
# Dapatkan semua paket
curl http://localhost:3000/packages

# Dapatkan user dengan ID 1
curl http://localhost:3000/users/1

# Buat transaksi baru
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"userId":"1", "packageId":"1", "date":"2026-01-22"}'
```

## 📖 Panduan Penggunaan

### Untuk Admin

1. **Login**

   - Buka aplikasi di browser
   - Masukkan username: `admin`
   - Masukkan password: `admin123`
   - Klik tombol Login

2. **Mengelola Pelanggan**

   - Klik menu "Customers" di sidebar
   - Lihat daftar semua pelanggan
   - Klik nama pelanggan untuk melihat detail lengkap

3. **Mengelola Paket**

   - Klik menu "Packages" di sidebar
   - Lihat semua paket data yang tersedia
   - Tambah, edit, atau hapus paket (jika tersedia fiturnya)

4. **Melihat Transaksi**
   - Klik menu "Transactions" di sidebar
   - Lihat riwayat semua transaksi penjualan
   - Filter atau search transaksi (jika tersedia)

### Untuk Customer

1. **Login**

   - Buka aplikasi di browser
   - Masukkan username: `john` atau `budi`
   - Masukkan password yang sesuai
   - Klik tombol Login

2. **Membeli Paket Data**

   - Akan langsung diarahkan ke halaman "Purchase"
   - Lihat daftar paket yang tersedia
   - Pilih paket yang ingin dibeli
   - Klik tombol "Beli" atau "Checkout"
   - Konfirmasi pembelian

3. **Melihat Riwayat Pembelian**

   - Klik menu "History" di sidebar/navbar
   - Lihat semua transaksi yang telah dilakukan
   - Detail transaksi mencakup tanggal, paket, dan harga

4. **Update Profil**
   - Klik menu "Profile" di sidebar/navbar
   - Edit informasi personal (nama, email, telepon, alamat)
   - Klik simpan untuk update profil

### Data tidak tersimpan

- Pastikan JSON Server berjalan di terminal terpisah
- Periksa tab Network di DevTools untuk melihat API requests

## 📚 Referensi & Resources

- [React Documentation](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Material-UI (MUI) Docs](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
- [Axios Documentation](https://axios-http.com)
- [JSON Server](https://github.com/typicode/json-server)
