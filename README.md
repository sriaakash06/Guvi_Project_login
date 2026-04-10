# 🌌 Guvi 3D Authentication & Profile Dashboard
<img width="200" alt="Screenshot 2026-04-10 150730" src="https://github.com/user-attachments/assets/0a202e19-0c38-49e4-8cd6-b80e231858d7" />
<img width="200" alt="Screenshot 2026-04-10 150748" src="https://github.com/user-attachments/assets/54504b05-0b20-4715-9461-b96dbb30fd6a" />
<img width="200" alt="Screenshot 2026-04-10 150828" src="https://github.com/user-attachments/assets/da886557-f516-42d9-9c43-db215cbab3bb" />


A premium, full-stack web application featuring a stunning 3D interactive interface, high-performance session management, and secure profile handling.

## 🚀 Live Demo

[View Live Project](https://guvi-project.infinityfree.me/)

## 🛠️ Tech Stack

### Frontend

- **HTML5 & CSS3**: Custom glassmorphism design for a premium feel.
- **JavaScript (jQuery/AJAX)**: Seamless, no-page-reload user experience.
- **Three.js**: Interactive 3D particle background for modern aesthetics.

### Backend

- **PHP (8.3)**: Robust server-side logic and API handling.
- **MySQL**: Persistent storage for user credentials and detailed profiles.
- **Redis (Upstash)**: High-performance session management using RESTful API calls.

## 🔒 Security Features

- **Bcrypt Password Hashing**: Passwords are never stored in plain text.
- **SQL Prepared Statements**: Protection against SQL Injection attacks.
- **Centralized Config**: Sensitive credentials moved to `config.php` (excluded via `.gitignore`).
- **Session Protection**: Redis-based session tokens with automatic expiration.

## 📂 Project Structure

```text
/
├── css/            # Style definitions
├── js/             # UI Logic & AJAX Handlers
├── php/            # API Endpoints & Auth Logic
│   └── config.php  # (Excluded) DB & Redis Credentials
├── assets/         # Images and icons
├── index.html      # Landing Page
├── login.html      # 3D Login Interface
├── register.html   # 3D Registration Interface
└── profile.html    # User Dashboard
```

## ⚙️ Installation & Setup

1. Clone the repository.
2. Create two MySQL tables: `users` and `profiles`.
3. Set up a Redis database on [Upstash](https://upstash.com).
4. Create/update `php/config.php` with your database and Redis credentials.
5. Deploy to any PHP-supported server (e.g., InfinityFree, XAMPP).

---
Developed as part of the **Guvi Internship Project**.
