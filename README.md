# Wombto18 App

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss)

A comprehensive platform for maternal and child health tracking, vaccination reminders, and environmental impact through the Go Green initiative.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express, MongoDB, JWT
- **Frontend:** React, Vite, Tailwind CSS

---

## 📂 Folder Structure

```
backend/   # Express API, models, controllers, services
frontend/  # React app, pages, components, assets
```

---

## 🛠️ Quick Start

### 1. Clone the repository

```sh
git clone <repo-url>
cd Wombto18-app
```

### 2. Backend Setup

```sh
cd backend
cp .env.example .env   # Fill in your environment variables
npm install
npm start              # or npm run dev for development
```

### 3. Frontend Setup

```sh
cd ../frontend
cp .env.example .env   # Set API URL if needed
npm install
npm run dev
```

---

## ⚙️ Environment Configuration

**Backend:** See `backend/.env.example` for all required variables (MongoDB URI, JWT secret, SMTP, etc).

**Frontend:** See `frontend/.env.example` for API URL config.

---

## ✨ Features

### Backend

- User authentication & authorization (JWT)
- OTP-based login (test mode: `123456`)
- Admin, parent, partner, and child management
- Maternal and child health tracking
- Vaccination scheduling & reminders
- Go Green initiative & impact tracking
- Payment & coupon management
- Activity logging & rate limiting
- Security hardening (Helmet, CORS, HTTPS redirect, IP allowlisting)

### Frontend

- Responsive dashboards for admins, parents, partners
- User registration & OTP login
- Partner registration with QR code generation
- Child & maternal profile management
- Vaccine schedule & reminders
- Impact & Go Green pages
- Settings & plan selection

---

## 📦 Usage

1. Register or log in as a user (admin, parent, or partner).
2. Add and manage child/maternal profiles.
3. View vaccination schedules and receive reminders.
4. Track Go Green impact and view dashboards.
5. Manage payments, coupons, and settings.

---

## 🔒 Security

The backend includes the following security measures:

| Feature                | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| **Helmet**             | Sets 15+ security HTTP headers (CSP, HSTS, X-Frame-Options, etc.)       |
| **CORS**               | Restricted to allowed origins via `CORS_ORIGINS` env var                |
| **HTTPS Redirect**     | Enforced in production via `x-forwarded-proto`                          |
| **Rate Limiting**      | Global (100 req/15min) + strict auth endpoints (10 req/15min)           |
| **Admin IP Allowlist** | Optional `ADMIN_ALLOWED_IPS` restricts admin route access in production |
| **JWT Security**       | No query-string tokens; production crashes if `JWT_SECRET` is not set   |
| **Input Validation**   | MongoDB ObjectId validation, pagination capped at 100, 1MB body limit   |
| **Payload Protection** | Oversized requests return `413 Payload Too Large`                       |
| **Activity Logging**   | All critical admin operations are audit-logged                          |

### Security Environment Variables

```env
# backend/.env
CORS_ORIGINS=https://yourdomain.com        # Comma-separated allowed origins
ADMIN_ALLOWED_IPS=                          # Comma-separated IPs (production only)
JWT_SECRET=your_strong_secret               # Required in production
```

---
