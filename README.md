# 🌌 Guvi 3D Authentication & Profile Dashboard

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
