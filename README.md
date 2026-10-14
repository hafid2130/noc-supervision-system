# 🛰️ Enterprise NOC Supervision Matrix System

An enterprise-grade, single-page Network Operations Center (NOC) supervision dashboard engineered with a hybrid architecture (**Python/Flask** backend and **React/Vite** frontend). Features real-time WebSocket telemetry, interactive Recharts latency monitoring, dynamic role-based access control (RBAC), Llama-3.2 AI diagnostics, dark/light theme switching, and full bilingual support (ID/EN).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_18_%2C_Vite_%2C_Tailwind_v4-61DAFB?logo=react)
![Python](https://img.shields.io/badge/Backend-Python_Flask_%2C_SocketIO-3776AB?logo=python)
![AI](https://img.shields.io/badge/AI-Llama--3.2_Diagnostics-FF6F00)

---

## ✨ Key Features

* **⚡ Real-Time Telemetry Engine:** Bidirectional WebSocket streaming (`Flask-SocketIO`) delivering sub-second latency, download, and upload throughput updates.
* **📊 Single-Page No-Scroll Matrix UI:** Compact, industry-friendly responsive layout featuring custom circular gauge metrics and Recharts interactive trend lines.
* **🤖 Autonomous AI Diagnostics:** Integrated AI engine evaluating network health, anomaly detection, and automated remediation protocols.
* **🛡️ Role-Based Access Control (RBAC):** Multi-tier access management (Visitor vs. Admin) with PIN-protected configuration modal.
* **🌐 Enterprise-Ready Multi-Language & Theme Support:** Instant toggle between Dark Mode / Light Mode and Bahasa Indonesia / English localization.
* **🧩 Modular Architecture:** Clean separation of concerns with dedicated component modules (`DashboardMatrix`, `NetworkMonitor`, `AiDiagnostics`) for easy enterprise maintenance.

---

## 🏗️ System Architecture

			    +-------------------+
                            |  React + Vite UI  |
                            |  (Tailwind CSS v4)|
                            +---------+---------+
                                      |
                           WebSocket / REST API
                                      |
                            +---------+---------+
                            | Flask Telemetry   |
                            |   & SocketIO      |
                            +---------+---------+
                                      |
                           +----------+----------+
                           | Real Ping / AI Engine|
                           +---------------------+


---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **Python** (v3.10 or higher)

### 1. Clone Repository
```bash
git clone [https://github.com/USERNAME/noc-supervision-system.git](https://github.com/USERNAME/noc-supervision-system.git)
cd noc-supervision-system

Backend Setup

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install flask flask-socketio flask-cors

# Start Telemetry Engine
python app.py

Backend runs on http://127.0.0.1:5000


Frontend Setup

cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

Access dashboard in browser at http://localhost:5173


License

---

### Bagian 2: Langkah-Langkah Deploy Live Menggunakan GitHub

Berikut adalah panduan lengkap untuk menyimpan proyek di **GitHub** dan menghubungkannya ke layanan hosting gratis (**Render** untuk backend Python dan **Vercel** untuk frontend React) agar aplikasi Anda bisa **LIVE 24/7** dengan tautan domain publik.

---

#### Langkah 1: Buat Repositori di GitHub
1. Buka [GitHub.com](https://github.com/) dan pastikan Anda sudah masuk ke akun Anda.
2. Klik tombol **`+`** di pojok kanan atas, pilih **New repository**.
3. Isi nama repositori: `noc-supervision-system`.
4. Pilih **Public** (agar dapat ditampilkan sebagai portofolio), lalu klik **Create repository**.

---

#### Langkah 2: Buat File Pendukung untuk Server Cloud (Backend)
Agar server cloud (seperti Render) tahu modul apa saja yang harus diinstal untuk menjalankan Python Flask Anda, buat file **`requirements.txt`** di folder utama (`D:\Projects\noc-supervision-system\requirements.txt`):

**Penting:** Buat file `requirements.txt` di root folder dengan isi:
```text
flask
flask-socketio
flask-cors
gunicorn
eventlet

Push Kode Proyek Anda ke GitHub

# Inisialisasi Git
git init

# Tambahkan file .gitignore agar folder venv & node_modules tidak ikut terunggah
echo "venv/" > .gitignore
echo "node_modules/" >> .gitignore
echo "frontend/node_modules/" >> .gitignore

# Commit seluruh file
git add .
git commit -m "Initial commit: NOC Supervision Matrix System"

# Hubungkan ke repository GitHub Anda (ganti USERNAME dengan username GitHub Anda)
git branch -M main
git remote add origin https://github.com/USERNAME/noc-supervision-system.git
git push -u origin main


Deploy Backend Python ke Render (Gratis)
Buka render.com dan buat akun menggunakan login GitHub.

Klik New + -> Pilih Web Service.

Pilih repositori GitHub noc-supervision-system yang baru di-push.

Isi konfigurasi sebagai berikut:

Name: noc-telemetry-backend

Runtime: Python 3

Start Command: gunicorn --worker-class eventlet -w 1 app:app

Klik Create Web Service. Tunggu beberapa saat hingga Render memberikan URL Backend Live Anda (misal: [https://noc-telemetry-backend.onrender.com](https://noc-telemetry-backend.onrender.com)).


Hubungkan Frontend ke Backend Cloud & Deploy ke Vercel
Buka file frontend/src/App.jsx, ubah alamat SOCKET_URL di bagian atas dari IP lokal ke URL Render Anda:

Javascript
// Ganti dari http://127.0.0.1:5000 ke URL Render Anda
const SOCKET_URL = 'https://noc-telemetry-backend.onrender.com';

Commit dan push perubahan ke GitHub:

git add .
git commit -m "Update SOCKET_URL for live production"
git push origin main


Buka vercel.com dan buat akun via GitHub.

Klik Add New... -> Pilih Project.

Impor repositori noc-supervision-system.

Pada bagian Root Directory, klik Edit dan pilih folder frontend.

Klik Deploy.