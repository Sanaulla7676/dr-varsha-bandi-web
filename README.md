# Homeopathway Clinic Management System

[![Continuous Integration](https://github.com/homeopathway/mefy-webapp/actions/workflows/ci.yml/badge.svg)](https://github.com/homeopathway/mefy-webapp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4.0.0--beta-blue.svg)](https://tailwindcss.com/)
[![Testing Framework: Vitest](https://img.shields.io/badge/Testing-Vitest-brightgreen.svg)](https://vitest.dev/)

A premium, state-of-the-art clinical management system designed for homeopathic practices. Homeopathway facilitates secure patient tracking, consultations, schedules, reports, digital prescriptions, and live signals (video consultations) under a beautiful, theme-aware modern interface.

---

## ⚡ 2026 System Modernization Campaign

This repository has undergone a comprehensive modernization campaign addressing legacy tech debt and security vulnerabilities:

1. **TypeScript Integration (`.ts`/`.tsx`)**: Ported core frontend structures (Zustand state managers, Axios clients, main routes) to strictly-typed TS templates, introducing clear schemas for domain objects (`Doctor`, `AuthState`, `UIState`).
2. **Tailwind CSS v4.0 Migration**: Consolidated version conflicts by cleaning legacy configuration scripts and standardizing styling directly inside `src/index.css` via modern CSS-first `@theme` and `@utility` rules.
3. **Dual-Token Security Architecture**: Upgraded user session flows to use short-lived **15-minute Access Tokens** paired with long-lived **7-day Refresh Tokens** on the backend, alongside an automatic silent token-rotation interceptor on the frontend.
4. **Advanced Backend Security**: Integrated HTTP security headers via `helmet`, dynamic domain validation inside `cors`, and strict endpoint rate limiters (**100 req / 15 min** globally, **15 req / 15 min** on auth endpoints).
5. **Interactive Testing Setup**: Configured a modern unit testing environment using `Vitest` and `JSDOM`, ensuring absolute reliability of Zustand stores, local storage state persistence, and client logic.
6. **Premium Error Resilience**: Designed a gorgeous glassmorphic React `ErrorBoundary` fallback component with real-time stack diagnostics in development, protecting the live interface from script crashes.
7. **Automated CI/CD Workflows**: Established a comprehensive GitHub Actions YAML pipeline that automates dependency resolving, unit tests execution, and production type checking on every codebase change.
8. **Dynamic Stitch Asset resolving**: Refactored the `convert.cjs` helper script to accept custom folders, gracefully making placeholders to prevent runtime compilation failures.

---

## 📂 Project Architecture

```bash
mefy-webapp/
├── .github/workflows/         # Automated CI/CD pipelines
│   └── ci.yml
├── backend/                  # Secure Node/Express signal server
│   ├── config/               # Database and signaling rules
│   ├── middleware/           # Access token verification & rate limiters
│   ├── models/               # MongoDB Database Schemas
│   ├── routes/               # Token-signed APIs and endpoints
│   ├── server.js             # Main backend application file
│   └── package.json
├── src/                      # Type-safe React Frontend
│   ├── components/           # Reusable UI (including ErrorBoundary)
│   ├── lib/                  # Type-safe api clients & Axios interceptors
│   ├── pages/                # High-fidelity dashboard sheets & pages
│   ├── store/                # Type-safe Zustand store modules & tests
│   ├── test/                 # Test setups & configurations
│   ├── App.tsx               # Primary Routing and Query structures
│   ├── index.css             # Main stylesheet & Tailwind v4 theme definitions
│   └── main.tsx              # TypeScript React bundle entrypoint
├── tsconfig.json             # TS Compiler instructions
├── vitest.config.ts          # Vitest testing suite setups
├── vite.config.ts            # Vite compiling plugin configurations
├── convert.cjs               # stitch-to-jsx refactoring tools
└── package.json
```

---

## 🚀 Development Quickstart

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.x or v20.x recommended) and [npm](https://www.npmjs.com/) installed locally.

### 1. Frontend Setup & Run

1. Install frontend dependencies:
   ```bash
   npm install
   ```
2. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   The site will be available locally at `http://localhost:5173`.

### 2. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Establish your environment properties in a `.env` file inside the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/homeopathway
   JWT_SECRET=your_jwt_access_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   ```
4. Start the backend signaling and database server:
   ```bash
   npm run dev
   ```
   *Note: If MongoDB is not running or fails to connect, the backend gracefully starts a mock fallback mode automatically.*

---

## 🧪 Testing & Validation

Run the Vitest test suite locally with:
```bash
npm run test
```

To compile the type-checked production bundle, run:
```bash
npm run build
```

---

## 🔒 Security Summary

Our clinical app takes data security seriously with:
*   **Dual Tokens (JWT)**: Expire Access Tokens in 15m; rotate Refresh Tokens on the client automatically inside Axios interceptors.
*   **Helmet & CORS**: Harden HTTP headers against Clickjacking, CSS injection, and CSRF attacks, while CORS rejects unapproved origins.
*   **IP Rate Limiting**: Prevent Brute-Force and DDoS attacks on authentication endpoints.
