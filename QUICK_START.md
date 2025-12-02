# Portfolio Management Web Application - Quick Start

**Last Updated:** December 2, 2025

## 🎯 What This App Does

A modern web application for managing multiple investment portfolios including:
- 🏛️ **Cooperative** - Track savings and investments in cooperative institutions
- 💼 **Provident Fund (PVD)** - Monitor employee and employer contributions
- 📊 **Mutual Funds** - Manage fund investments with NAV tracking
- 📈 **Stocks** - Track stock portfolios with real-time pricing
- 💰 **Savings** - Monitor general savings accounts

## ✅ Implemented Features

### Core Features ✅
- **Multi-Portfolio Management** - Create and manage unlimited portfolios
- **Transaction Tracking** - Deposit/withdrawal with detailed type-specific fields
- **Real-Time Analytics** - Performance charts and statistics
- **Dashboard** - Overview of all investments with visual charts
- **Authentication** - Email/password login with 2FA support
- **Dark Mode** - Full dark mode support throughout the app
- **Profile Management** - Update profile, change password/email
- **Profile Photos** - Base64 storage (no Firebase Storage needed!)
- **Data Export** - PDF reports and CSV exports

### Investment Type Features ✅
- **Cooperative**: Period tracking, dividend management
- **PVD**: Employee/employer contributions, yearly breakdown, CSV export
- **Mutual Fund**: NAV tracking, units calculation, performance monitoring
- **Stock**: USD/THB conversion, Yahoo Finance integration, real-time prices
- **Savings**: Simple deposit/withdrawal tracking

### Security Features ✅
- Strong password requirements (8+ chars, mixed case, numbers, symbols)
- Input validation and sanitization
- Rate limiting (login, OTP, password reset)
- 2FA/OTP authentication via EmailJS
- Secure session management
- HTTPS enforcement
- Content Security Policy (CSP)

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Firebase account (free tier is fine!)
- EmailJS account (optional, for 2FA)

### Step 1: Clone and Install
```bash
cd Portfolio-Management-Web-Application
npm install
```

### Step 2: Set Up Firebase
1. Create project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Email/Password Authentication
4. Copy your Firebase config

### Step 3: Configure Environment
Create `.env` file:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS (Optional - for 2FA/OTP emails)
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

### Step 4: Set Up Firestore Security Rules
Go to Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /portfolios/{portfolioId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /transactions/{transactionId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /otps/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 5: Create Firestore Index
Go to Firestore → Indexes → Add Index:
```
Collection: transactions
Fields: userId (Ascending), portfolioId (Ascending), date (Descending)
```

### Step 6: Run the App
```bash
npm run dev
```

Visit `http://localhost:5173` and create your account!

## 📱 Usage Guide

### Creating Your First Portfolio
1. Register/Login to the app
2. Click "Create Portfolio" button
3. Choose investment type (Cooperative, PVD, Mutual Fund, Stock, or Savings)
4. Enter portfolio name and optional target amount
5. Click "Create Portfolio"

### Adding Transactions
1. Click "Add Transaction" on any portfolio card
2. Select transaction type (Deposit/Withdrawal)
3. Enter amount and date
4. Fill in type-specific fields:
   - **Cooperative**: Period, dividend amount
   - **PVD**: Year, period, month, employee & employer contributions
   - **Mutual Fund**: Units purchased, price per unit
   - **Stock**: Ticker, units, price (USD), exchange rate
   - **Savings**: Just amount and notes
5. Click "Add Transaction"

### Updating Prices
- **Mutual Funds**: Click "Update NAV" → Enter new NAV per unit
- **Stocks**: Click "Update Price" → Enter ticker → Auto-fetch from Yahoo Finance

### Viewing Reports
- **PVD Details**: Click portfolio → "View PVD Details" → Export to CSV
- **Cooperative Details**: Click portfolio → "View Cooperative Details" → Export to CSV
- **All Transactions**: Dashboard → "Export to PDF" (generates full report)

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddTransactionModal.tsx
│   ├── CreatePortfolioModal.tsx
│   ├── EditPortfolioModal.tsx
│   ├── PerformanceChart.tsx
│   ├── PortfolioDistributionChart.tsx
│   ├── PortfolioList.tsx
│   ├── TransactionList.tsx
│   └── ...
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration
│   ├── Settings.tsx    # User settings
│   ├── PVDDetail.tsx   # PVD breakdown
│   └── CooperativeDetail.tsx
├── services/           # API and business logic
│   ├── auth.ts         # Authentication
│   ├── firebase.ts     # Firebase config
│   ├── portfolio.ts    # Portfolio CRUD
│   ├── transaction.ts  # Transaction CRUD
│   ├── otp.ts          # 2FA/OTP
│   └── storage.ts      # Profile photos (Base64)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── usePortfolio.ts
│   └── useTransaction.ts
├── types/              # TypeScript definitions
│   ├── portfolio.ts
│   ├── transaction.ts
│   └── user.ts
├── utils/              # Utility functions
│   ├── validation.ts   # Input validation & rate limiting
│   ├── exportToCSV.ts
│   └── exportToPDF.ts
└── contexts/           # React contexts
    ├── ThemeContext.tsx
    └── ToastContext.tsx
```

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth)
- **State**: Zustand + React Context
- **Routing**: React Router v6
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Email**: EmailJS (for OTP)
- **PDF**: jsPDF + jsPDF-AutoTable
- **Date**: date-fns

## 📊 Data Model

### Collections
- **users** - User profiles and preferences
- **portfolios** - Investment portfolios
- **transactions** - All transactions (deposits/withdrawals)
- **otps** - Temporary OTP codes for 2FA

### Transaction Types
Each transaction can have type-specific details:
- `cooperativeDetails` - { period, dividendAmount }
- `pvdDetails` - { year, period, month, employeeContribution, employerContribution }
- `mutualFundDetails` - { unitsPurchased, pricePerUnit }
- `stockDetails` - { ticker, unitsPurchased, pricePerUnitUSD, exchangeRate }

## 🔒 Security Features

✅ Environment variables for sensitive data  
✅ Firebase Security Rules enforcing user ownership  
✅ Strong password requirements (8+ chars, mixed)  
✅ Input validation and XSS protection  
✅ Rate limiting (5 login attempts / 15 min)  
✅ 2FA/OTP authentication (optional)  
✅ HTTPS enforcement via HSTS  
✅ Content Security Policy headers  
✅ No sensitive console logs in production  

## 📦 Deployment

### Option 1: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 🐛 Troubleshooting

### "Firebase index required" error
- Click the link in the error message
- Firebase will create the index automatically
- Wait 1-2 minutes for it to build

### OTP emails not sending
- Check EmailJS configuration in `.env`
- Verify EmailJS service is active
- Check browser console for errors

### Profile photo too large
- Resize image to 400x400px or smaller
- Use JPG format with 80% quality
- Maximum file size: 5MB (recommended: <700KB)

## 📚 Documentation

- **[API Documentation](./docs/api-documentation.md)** - Service APIs and methods
- **[Database Schema](./docs/database-schema.md)** - Firestore collections and structure
- **[Setup Guide](./docs/setup-guide.md)** - Detailed installation instructions
- **[Security Guide](./docs/security-improvements.md)** - Security features and best practices
- **[Deployment Checklist](./docs/deployment-checklist.md)** - Pre-deployment checklist

## 🎯 Next Steps

1. **Customize Theme**: Edit `tailwind.config.js` for your brand colors
2. **Add More Features**: Check `requirements.md` for feature ideas
3. **Deploy**: Choose a hosting platform and deploy
4. **Monitor**: Set up Firebase Analytics for usage tracking
5. **Backup**: Enable Firestore backups in Firebase Console

## 🤝 Support

For issues or questions:
1. Check the documentation in `/docs` folder
2. Review Firebase documentation
3. Check browser console for errors

## 📄 License

This project is open source and available for personal use.

---

**Ready to start?** Run `npm run dev` and open http://localhost:5173! 🚀
