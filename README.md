# Portfolio Management Web Application 💼

A modern, secure web application for managing personal investment portfolios built with React, TypeScript, and Firebase. Track multiple investment types including Cooperative savings, PVD (Provident Fund), Mutual Funds, Stocks, and Savings accounts with real-time analytics and reporting.

[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-61DAFB?logo=react)](https://react.dev)
[![Database Firebase](https://img.shields.io/badge/Database-Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev)

---

## 🌟 Features

### ✅ Core Features (Fully Implemented)
- 📊 **Real-Time Dashboard** - Portfolio overview with performance charts
- 💰 **5 Investment Types** - Cooperative, PVD, Mutual Funds, Stocks, and Savings
- 📈 **Performance Analytics** - ROI tracking, return calculations, visual charts
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Secure Auth + 2FA** - Email/password login with optional OTP verification
- ☁️ **Cloud Sync** - Real-time Firestore database synchronization
- 🌙 **Dark Mode** - Complete dark/light theme support
- 👤 **Profile Management** - Update profile, change password/email, profile photos
- 📤 **Data Export** - PDF reports and CSV exports
- 🔒 **Enterprise Security** - Input validation, rate limiting, XSS protection

### Investment Type Features

#### 🏛️ Cooperative
- Period and dividend tracking
- Detailed transaction history
- CSV export by year
- View dedicated Cooperative detail page

#### 💼 PVD (Provident Fund)
- Employee and employer contribution tracking
- Yearly/monthly breakdown
- Period-based reporting
- CSV export functionality
- Dedicated PVD detail page

#### 📊 Mutual Funds
- NAV (Net Asset Value) tracking
- Units purchased calculation
- Current value vs invested
- Update NAV functionality
- Performance monitoring

#### 📈 Stock Investment
- Multi-currency (USD/THB)
- Yahoo Finance API integration for real-time prices
- Exchange rate tracking
- Average cost calculation
- Automatic price updates

#### 💰 Savings
- Simple deposit/withdrawal tracking
- Balance monitoring
- Transaction notes

---

## 🚀 Quick Start

**Want to get started fast?** Follow these steps:

### Prerequisites
- Node.js >= 18.0.0
- Firebase account (free tier works fine!)
- EmailJS account (optional, for 2FA/OTP)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/supawitsaelimscb/Portfolio-Management-Web-Application.git
cd Portfolio-Management-Web-Application

# 2. Install dependencies
npm install

# 3. Create Firebase project
# Go to https://console.firebase.google.com
# Create a new project (or use existing)
# Enable Authentication (Email/Password)
# Create Firestore Database (Start in test mode)

# 4. Copy and configure environment variables
cp .env.example .env
# Edit .env and fill in your Firebase config:
# - VITE_FIREBASE_API_KEY
# - VITE_FIREBASE_AUTH_DOMAIN
# - VITE_FIREBASE_PROJECT_ID
# - VITE_FIREBASE_STORAGE_BUCKET
# - VITE_FIREBASE_MESSAGING_SENDER_ID
# - VITE_FIREBASE_APP_ID

# 5. (Optional) Setup EmailJS for 2FA
# Go to https://www.emailjs.com
# Create account and email template
# Add to .env:
# - VITE_EMAILJS_PUBLIC_KEY
# - VITE_EMAILJS_SERVICE_ID
# - VITE_EMAILJS_TEMPLATE_ID

# 6. Run development server
npm run dev
```

Visit http://localhost:5173 and start tracking your investments!

**Detailed Setup:** See **[QUICK_START.md](./QUICK_START.md)** for step-by-step guide with screenshots.

---

## 📋 Documentation

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | ⚡ 5-minute setup guide (START HERE!) |
| **[Requirements](docs/requirements.md)** | Complete feature list and requirements |
| **[Technical Architecture](docs/technical-architecture.md)** | System design and architecture |
| **[Setup Guide](docs/setup-guide.md)** | Detailed installation instructions |
| **[API Documentation](docs/api-documentation.md)** | Service APIs and methods |
| **[Database Schema](docs/database-schema.md)** | Firestore structure and security rules |
| **[Security Guide](docs/security-improvements.md)** | Security features and best practices |
| **[Deployment Checklist](docs/deployment-checklist.md)** | Pre-deployment checklist |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router v6
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **State:** React Context + Custom Hooks
- **Toasts:** Custom Toast System

### Backend & Services
- **Authentication:** Firebase Auth (Email/Password + 2FA)
- **Database:** Firestore (NoSQL, real-time)
- **Email:** EmailJS (OTP/2FA emails)
- **Photo Storage:** Base64 (no Firebase Storage needed!)
- **Stock Prices:** Yahoo Finance API

### Security
- **Rate Limiting:** Client-side with planned server-side upgrade
- **Validation:** Zod schemas + custom validators
- **Sanitization:** XSS protection
- **Headers:** CSP, HSTS, X-Frame-Options
- **Password:** 8+ chars, mixed case, numbers, symbols

### Deployment Options
- Firebase Hosting (recommended)
- Vercel
- Netlify
- GitHub Pages

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│         React SPA (Vite + TypeScript)            │
│  ┌────────────┬────────────┬──────────────┐     │
│  │  Dashboard │ Portfolios │ Transactions │     │
│  └────────────┴────────────┴──────────────┘     │
│  ┌────────────────────────────────────────┐     │
│  │   Services Layer (Firebase SDK)        │     │
│  │   - Auth  - Portfolio  - Transaction   │     │
│  │   - OTP   - Storage    - Validation    │     │
│  └────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────┘
                   │ HTTPS/WSS
                   ▼
┌──────────────────────────────────────────────────┐
│            Firebase Backend (Free Tier)          │
│  ┌─────────────┬──────────────┬──────────────┐  │
│  │  Auth       │  Firestore   │  EmailJS     │  │
│  │  (Users)    │  (Database)  │  (OTP Email) │  │
│  └─────────────┴──────────────┴──────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
src/
├── components/        # UI components
│   ├── *Modal.tsx     # Various modals
│   ├── *Chart.tsx     # Chart components
│   └── *List.tsx      # List components
├── pages/            # Application pages
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Settings.tsx
│   ├── PVDDetail.tsx
│   └── CooperativeDetail.tsx
├── services/         # Business logic & APIs
│   ├── auth.ts
│   ├── portfolio.ts
│   ├── transaction.ts
│   ├── otp.ts
│   └── storage.ts
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── utils/           # Utilities & helpers
└── contexts/        # React contexts
```

---

## 🚀 Deployment

### Option 1: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel (One Command)
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

**Important:** Set environment variables in your hosting platform's dashboard!

See **[Deployment Checklist](docs/deployment-checklist.md)** for full guide.

---

## 🎯 What's Implemented vs What's Not

### ✅ Fully Implemented
- All 5 investment types (Cooperative, PVD, Mutual Fund, Stock, Savings)
- Portfolio CRUD operations
- Transaction management with type-specific fields
- Dashboard with charts and statistics
- Dark mode
- Profile management with photos (Base64)
- 2FA/OTP authentication
- PDF and CSV exports
- Security features (validation, rate limiting, XSS protection)
- Responsive design

### ⚠️ Not Implemented (From Original Docs)
- Multi-language support (only English)
- Firebase Cloud Functions
- Bulk CSV import of transactions
- Email notifications
- Real-time market data feeds (except Yahoo Finance for stocks)
- Advanced AI-powered insights

**The app is fully functional for personal portfolio management!**

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request
---

## 📄 License

This project is open source and available for personal use.

---

## 👤 Author

**Supawit Saelim**
- GitHub: [@supawitsaelimscb](https://github.com/supawitsaelimscb)
- Repository: [Portfolio-Management-Web-Application](https://github.com/supawitsaelimscb/Portfolio-Management-Web-Application)

---

## 🙏 Acknowledgments

- [React](https://react.dev) - The UI framework
- [Firebase](https://firebase.google.com) - Backend platform
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Recharts](https://recharts.org) - Chart library
- [Vite](https://vitejs.dev) - Build tool
- [EmailJS](https://www.emailjs.com/) - Email service for OTP
- [Yahoo Finance](https://finance.yahoo.com/) - Stock price data

---

## 📞 Support

Need help? Check out:

1. **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide
2. **[Documentation](docs/)** - Comprehensive guides
3. **[Firebase Docs](https://firebase.google.com/docs)** - Firebase help
4. **[Issues](https://github.com/supawitsaelimscb/Portfolio-Management-Web-Application/issues)** - Report bugs

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you manage your investments!

---

**Built with ❤️ for better financial management**