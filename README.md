# 📚 CourseDu

CourseDu adalah aplikasi web berbasis Node.js dengan database MySQL yang
berjalan di `localhost:8080`.

------------------------------------------------------------------------

## 🚀 Getting Started

Ikuti langkah-langkah berikut untuk menjalankan project secara lokal.

------------------------------------------------------------------------

## 1️⃣ Clone Repository

``` bash
git clone https://github.com/devwithfin/coursedu
cd coursedu
```

------------------------------------------------------------------------

## 2️⃣ Jalankan Local Server

Pastikan service berikut sudah running:

-   Apache
-   MySQL

Jika menggunakan XAMPP / Laragon / WAMP, aktifkan keduanya sebelum
lanjut.

------------------------------------------------------------------------

## 3️⃣ Setup Database

1.  Buka DBMS GUI (contoh: phpMyAdmin).
2.  Buat database baru dengan nama:

coursedu

3.  Import file `.sql` yang tersedia ke database `coursedu`.

------------------------------------------------------------------------

## 4️⃣ Install Dependencies

Pastikan kamu berada di root folder project, lalu jalankan:

``` bash
npm run install:all
```

Tunggu hingga proses selesai tanpa error.

------------------------------------------------------------------------

## 5️⃣ Jalankan Aplikasi

``` bash
npm run start
```

------------------------------------------------------------------------

## 6️⃣ Akses di Browser

Buka:

http://localhost:8080

Jika setup berhasil, akan muncul **5 card** di halaman utama.

------------------------------------------------------------------------

# 🛠 Requirements

-   Node.js (disarankan v16 atau lebih baru)
-   MySQL / MariaDB
-   npm
-   DBMS GUI (phpMyAdmin / HeidiSQL / DBeaver / dll)

------------------------------------------------------------------------

# ✅ Verifikasi

Pastikan:

-   Server berjalan tanpa error
-   Database terkoneksi
-   5 card tampil di homepage
-   Semua fitur bisa diuji

------------------------------------------------------------------------

# 📌 Notes

Jika terjadi error:

-   Pastikan MySQL aktif
-   Pastikan nama database `coursedu` sudah benar
-   Pastikan sudah berada di root folder sebelum menjalankan perintah
    npm
