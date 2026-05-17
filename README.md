# Forum Diskusi App

Aplikasi Forum Diskusi berbasis web yang dibangun menggunakan React, TypeScript, dan Vite. Proyek ini merupakan submission untuk kelas React Expert di Dicoding, dengan fokus pada implementasi fitur lanjutan seperti Automation Testing dan CI/CD.

## Fitur Utama

- Autentikasi pengguna (Login & Register)
- Melihat daftar thread diskusi dan detailnya
- Filter thread berdasarkan kategori
- Membuat thread baru
- Fitur Leaderboard untuk melihat pengguna paling aktif
- Menggunakan Redux Toolkit untuk state management
- Styling modern menggunakan Tailwind CSS
- Automation Testing komprehensif (Unit Test, Integration Test, dan E2E Test)
- Pipeline CI/CD terotomatisasi menggunakan GitHub Actions dan Netlify

## Cara Menjalankan Aplikasi Lokal

Pastikan Anda sudah menginstal Node.js di komputer Anda. Ikuti langkah-langkah berikut:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/PuhFahru/Automation-Testing-dan-CI-CD.git
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd Automation-Testing-dan-CI-CD
   ```

3. Instal semua dependensi:
   ```bash
   npm install
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

## Menjalankan Pengujian (Testing)

Proyek ini dilengkapi dengan pengujian otomatis untuk memastikan semua fitur berjalan dengan baik sebelum digabungkan ke production.

Menjalankan Unit Test dan Integration Test (menggunakan Vitest):
```bash
npm run test
```

Menjalankan End-to-End (E2E) Test (menggunakan Cypress):
```bash
npm run e2e
```

Menjalankan Linter untuk mengecek kerapian kode:
```bash
npm run lint
```

## CI/CD Pipeline

Proyek ini telah dikonfigurasi dengan GitHub Actions. Setiap kali ada perubahan kode (Push atau Pull Request) yang mengarah ke branch utama, GitHub akan otomatis menjalankan:
1. Pengecekan Linter
2. Pengujian Unit & Integration
3. Pengujian E2E di browser

Jika seluruh pengujian berhasil (Pass), kode tersebut akan langsung diproses untuk deployment otomatis ke Netlify.
