<div align="center">
  <h1>🧑‍💻 Alfarizqi Himam Harakan</h1>
  <p><strong>Backend & Infrastructure Engineer | Terminal UI Portfolio</strong></p>

  <p>
    <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white" />
    <img alt="Vanilla JS" src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black" />
    <img alt="VFS" src="https://img.shields.io/badge/Virtual_File_System-8E75B2" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
  </p>

  <p>
    <a href="#-fitur-unggulan">✨ Fitur</a>
    ·
    <a href="#-arsitektur">🏗️ Arsitektur</a>
    ·
    <a href="#-persiapan">🚀 Quick Start</a>
  </p>
</div>

---

<details>
<summary><strong>📑 Daftar Isi (klik untuk buka)</strong></summary>

- [Latar Belakang](#-latar-belakang)
- [Fitur Unggulan](#-fitur-unggulan)
- [Tech Stack](#-tech-stack)
- [Persiapan](#-persiapan)
- [Arsitektur](#-arsitektur)

</details>

---

## 🇮🇩 Latar Belakang

Portfolio ini dibuat untuk mensimulasikan lingkungan Terminal modern (TUI - Terminal User Interface) di dalam browser web. Terinspirasi oleh alat-alat seperti **Yazi File Manager**, **Neovim**, dan sistem fetch khas r/unixporn, portfolio ini dirancang khusus untuk merepresentasikan identitas saya sebagai Backend & Infrastructure Engineer yang menggunakan ekosistem terminal sebagai *daily driver*.

Seluruh interaksi di portfolio ini dapat dilakukan 100% menggunakan navigasi keyboard ala Vim (h/j/k/l).

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| ⌨️ **Vim Keybinds** | Navigasi penuh menggunakan `h j k l`, `Enter`, `o` untuk buka file, dan `Esc` |
| 🗂️ **Virtual File System** | Data merender seolah-olah file fisik (`.rs`, `.php`, `.md`) murni dari satu file JSON |
| 🎨 **Theme & Syntax** | Gruvbox dark theme dengan syntax highlighter kustom untuk Rust, JS, PHP, JSON, dan Markdown |
| 🚀 **Zero Dependency** | Pure Vanilla JS (ES6) tanpa build step, Webpack, atau Node.js |
| 🔍 **Search & Command** | Tekan `/` untuk mencari file dan `:` untuk menjalankan command (seperti `:reload`) |
| 🖥️ **Fastfetch** | Tampilan status sistem statis di root direktori (seperti screenfetch/neofetch) |

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| Struktur | HTML5 Semantic |
| Styling | TailwindCSS (via CDN) + Vanilla CSS untuk animasi |
| Logika Interaksi | Vanilla JavaScript (ES Modules) |
| Font | JetBrains Mono Nerd Font |
| Database | JSON statis (`data/tree.json`, `data/system.json`) |

---

## 🚀 Persiapan

### 1. Prasyarat
- Browser modern (Firefox / Chrome)
- Opsional: Web server lokal (Live Server)

### 2. Jalankan Secara Lokal
Karena proyek ini *zero-build-step*, Anda dapat langsung membuka `index.html` di browser Anda.

Atau menggunakan Python:
```bash
python -m http.server 8000
```
Lalu akses di `http://localhost:8000`.

---

## 🏗️ Arsitektur

Proyek menggunakan Virtual File System dimana seluruh representasi file di-render secara modular dari data JSON.

```
/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css          # Animasi ringan dan warna syntax highlighting
│   └── js/
│       ├── app.js             # Entry point (load state & init keyboard)
│       ├── state.js           # Single source of truth (VFS State & navigasi)
│       ├── keyboard.js        # Event listener keybind (h j k l, command, search)
│       ├── loader.js          # Fetch utility untuk JSON
│       ├── ui.js              # Sinkronisasi state ke manipulasi DOM
│       ├── syntax/            # Modul highlight code untuk rust, js, php
│       └── renderers/         # Registry pemetaan JSON -> output HTML kaya
└── data/
    ├── tree.json              # VFS Database utama (seluruh konten file ada di sini)
    └── system.json            # Data spesifikasi Fastfetch
```