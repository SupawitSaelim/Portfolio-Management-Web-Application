# Implementation Guide - Step by Step
## Portfolio Management Web Application

**Start Date:** November 29, 2025  
**Estimated Timeline:** 10-12 weeks for full MVP

This guide provides a step-by-step implementation plan with clear milestones and deliverables.

---

## 🎯 Implementation Philosophy

**Build in this order:**
1. ✅ **Database & Backend** (Foundation) - Week 1-2
2. ✅ **Authentication** (Security) - Week 2-3
3. ✅ **Core Features** (MVP) - Week 3-8
4. ✅ **Polish & Deploy** (Launch) - Week 9-12

---

## 📅 PHASE 1: Database & Backend Setup (Week 1-2)

### Step 1.1: Firebase Project Setup (Day 1)

**Goal:** Create and configure Firebase project

**Tasks:**
- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Enable Authentication
- [ ] Configure security rules
- [ ] Create indexes

**Detailed Instructions:**

1. **Create Firebase Project**
   ```bash
   # Go to: https://console.firebase.google.com
   # Click: "Add project"
   # Project name: portfolio-management-app
   # Enable Google Analytics: Yes (recommended)
   # Select Analytics location: Your region
   ```

2. **Enable Firestore**
   - Navigate to: Build → Firestore Database
   - Click: "Create database"
   - Mode: Start in **production mode**
   - Location: `asia-southeast1` (or closest to you)
   - Click: "Enable"

3. **Configure Security Rules**
   - Go to: Firestore Database → Rules tab
   - Copy rules from `docs/database-schema.md` (Section 5)
   - Paste into Rules editor
   - Click: "Publish"

4. **Create Indexes**
   - Go to: Firestore Database → Indexes tab
   - Create composite index:
     ```
     Collection: transactions
     Fields: userId (Ascending), portfolioId (Ascending), date (Descending)
     ```
   - Create another:
     ```
     Collection: transactions
     Fields: userId (Ascending), type (Ascending), date (Descending)
     ```

5. **Enable Authentication**
   - Navigate to: Build → Authentication
   - Click: "Get started"
   - Enable: Email/Password
   - Enable: Google (optional)

**Deliverable:** ✅ Firebase project ready with Firestore and Auth enabled

---

### Step 1.2: Initialize Local Project (Day 1)

**Goal:** Set up development environment

**Tasks:**
- [ ] Initialize React + Vite project
- [ ] Install dependencies
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure Firebase SDK

**Commands:**

```bash
# 1. Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# 2. Install core dependencies
npm install

# 3. Install Firebase
npm install firebase

# 4. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. Install routing
npm install react-router-dom

# 6. Install state management
npm install zustand

# 7. Install form handling
npm install react-hook-form zod @hookform/resolvers

# 8. Install UI components
npm install @headlessui/react @heroicons/react

# 9. Install charts
npm install recharts

# 10. Install utilities
npm install axios date-fns clsx tailwind-merge

# 11. Install dev dependencies
npm install -D @types/node
```

**Project Structure Setup:**

```bash
# Create folder structure
mkdir -p src/{components/{layout,dashboard,portfolio,transactions,analytics,charts,common},pages,services,store,hooks,utils,types}

# Create initial files
touch src/services/firebase.ts
touch src/services/api.ts
touch .env.example
touch .env
```

**Deliverable:** ✅ Project initialized with all dependencies

---

### Step 1.3: Configure Firebase Connection (Day 2)

**Goal:** Connect application to Firebase

**File to create:** `src/services/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence');
  }
});

export default app;
```

**Environment Variables** (`.env`):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Test Firebase Connection:**

Create `src/test-firebase.ts`:

```typescript
import { db } from './services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function testFirebaseConnection() {
  try {
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firebase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}
```

**Deliverable:** ✅ Firebase connected and tested

---

### Step 1.4: Define TypeScript Types (Day 2-3)

**Goal:** Create type definitions for all data models

**File:** `src/types/user.ts`

```typescript
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserPreferences {
  currency: 'THB' | 'USD';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  language: 'en' | 'th';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    weekly_summary: boolean;
  };
}
```

**File:** `src/types/portfolio.ts`

```typescript
export interface Portfolio {
  portfolioId: string;
  userId: string;
  name: string;
  description: string;
  currency: 'THB' | 'USD';
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  investmentTypes: InvestmentTypeBreakdown;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentTypeBreakdown {
  cooperative: InvestmentTypeSummary;
  pvd: InvestmentTypeSummary;
  mutualFund: InvestmentTypeSummary;
  stock: InvestmentTypeSummary;
  savings: InvestmentTypeSummary;
}

export interface InvestmentTypeSummary {
  count: number;
  totalValue: number;
  totalInvested: number;
  percentage: number;
}
```

**File:** `src/types/transaction.ts`

```typescript
export type TransactionType = 
  | 'cooperative' 
  | 'pvd' 
  | 'mutualFund' 
  | 'stock' 
  | 'savings';

export interface BaseTransaction {
  transactionId: string;
  userId: string;
  portfolioId: string;
  type: TransactionType;
  date: Date;
  amount: number;
  currency: 'THB' | 'USD';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MutualFundTransaction extends BaseTransaction {
  type: 'mutualFund';
  details: {
    fundName: string;
    installmentNumber: number;
    unitsPurchased: number;
    pricePerUnit: number;
    totalUnits: number;
    currentValue?: number;
    currentPricePerUnit?: number;
  };
}

export interface StockTransaction extends BaseTransaction {
  type: 'stock';
  details: {
    stockName: string;
    ticker: string;
    installmentNumber: number;
    unitsPurchased: number;
    pricePerUnit: number;
    exchangeRate: number;
    purchaseValueTHB: number;
    totalInvestment: number;
    currentValue?: number;
    currentPricePerUnit?: number;
  };
}

// Add other transaction types...

export type Transaction = 
  | MutualFundTransaction 
  | StockTransaction;
  // Add other types
```

**Deliverable:** ✅ All TypeScript types defined

---

## 📅 PHASE 2: Authentication System (Week 2-3)

### Step 2.1: Create Auth Service (Day 4)

**Goal:** Implement authentication functions

**File:** `src/services/auth.ts`

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User as AppUser } from '../types/user';

export const authService = {
  // Register new user
  async register(email: string, password: string, displayName: string): Promise<User> {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user document in Firestore
    const userDoc: Omit<AppUser, 'uid'> = {
      email,
      displayName,
      preferences: {
        currency: 'THB',
        dateFormat: 'DD/MM/YYYY',
        language: 'en',
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          weekly_summary: true,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', credential.user.uid), userDoc);

    return credential.user;
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await setDoc(
      doc(db, 'users', credential.user.uid),
      { lastLoginAt: new Date() },
      { merge: true }
    );

    return credential.user;
  },

  // Logout user
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Get current user data
  async getCurrentUser(): Promise<AppUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    return {
      uid: user.uid,
      ...userDoc.data(),
    } as AppUser;
  },
};
```

**Deliverable:** ✅ Authentication service implemented

---

### Step 2.2: Create Auth Hook (Day 5)

**Goal:** React hook for authentication state

**File:** `src/hooks/useAuth.ts`

```typescript
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/auth';
import type { User as AppUser } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await authService.getCurrentUser();
          setAppUser(userData);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.login(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      await authService.register(email, password, displayName);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    appUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
```

**Deliverable:** ✅ Authentication hook ready

---

### Step 2.3: Create Login & Register Pages (Day 6-7)

**Goal:** Build authentication UI

**File:** `src/pages/Login.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Deliverable:** ✅ Login/Register UI complete

---

## 📅 PHASE 3: Core Features Implementation (Week 3-8)

### Step 3.1: Portfolio Service (Week 3)

**File:** `src/services/portfolio.ts`

```typescript
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Portfolio } from '../types/portfolio';

export const portfolioService = {
  // Create portfolio
  async create(userId: string, data: Omit<Portfolio, 'portfolioId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const portfolioData = {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'portfolios'), portfolioData);
    return docRef.id;
  },

  // Get user's portfolios
  async getByUserId(userId: string): Promise<Portfolio[]> {
    const q = query(collection(db, 'portfolios'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      portfolioId: doc.id,
      ...doc.data(),
    })) as Portfolio[];
  },

  // Get single portfolio
  async getById(portfolioId: string): Promise<Portfolio | null> {
    const docRef = doc(db, 'portfolios', portfolioId);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    return {
      portfolioId: snapshot.id,
      ...snapshot.data(),
    } as Portfolio;
  },

  // Update portfolio
  async update(portfolioId: string, data: Partial<Portfolio>): Promise<void> {
    const docRef = doc(db, 'portfolios', portfolioId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete portfolio
  async delete(portfolioId: string): Promise<void> {
    const docRef = doc(db, 'portfolios', portfolioId);
    await deleteDoc(docRef);
  },
};
```

**Continue with:**
- Transaction service (Week 4)
- Analytics service (Week 5)
- Dashboard components (Week 6-7)
- Transaction forms (Week 7-8)

---

## 🎨 PHASE 4: UI Components (Week 6-10)

Build components in this order:
1. Layout components (Header, Sidebar, Footer)
2. Dashboard overview
3. Portfolio cards
4. Transaction forms
5. Charts and analytics
6. Settings page

---

## 🚀 PHASE 5: Testing & Deployment (Week 11-12)

1. Write unit tests
2. Integration testing
3. E2E testing with Cypress
4. Performance optimization
5. Deploy to GitHub Pages
6. Monitor and fix issues

---

## ✅ Daily Checklist Template

Use this for each day:

```markdown
## Day X - [Date]

**Goal:** [What to accomplish]

### Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Completed
- [x] Completed task 1
- [x] Completed task 2

### Blockers
- Issue description and resolution

### Tomorrow
- Plan for next day
```

---

## 📊 Progress Tracking

| Phase | Week | Status | Completion |
|-------|------|--------|------------|
| Database & Backend | 1-2 | ⬜ Not Started | 0% |
| Authentication | 2-3 | ⬜ Not Started | 0% |
| Core Features | 3-8 | ⬜ Not Started | 0% |
| UI Components | 6-10 | ⬜ Not Started | 0% |
| Testing & Deploy | 11-12 | ⬜ Not Started | 0% |

---

**Next Step:** Start with Step 1.1 - Firebase Project Setup!

Good luck! 🚀
