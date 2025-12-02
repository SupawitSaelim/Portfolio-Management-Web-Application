import { doc, setDoc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import emailjs from '@emailjs/browser';

// Validate EmailJS environment variables
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
  console.warn(
    '⚠️ EmailJS not configured. OTP emails will not be sent.\n' +
    'Please set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID in .env file.'
  );
}

// Initialize EmailJS with public key from environment
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export const otpService = {
  // Generate a random 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Store OTP in Firestore with expiration
  async storeOTP(userId: string, otp: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Valid for 10 minutes

    await setDoc(doc(db, 'otps', userId), {
      code: otp,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      attempts: 0,
    });
  },

  // Verify OTP
  async verifyOTP(userId: string, inputOTP: string): Promise<boolean> {
    try {
      const otpDoc = await getDoc(doc(db, 'otps', userId));

      if (!otpDoc.exists()) {
        return false;
      }

      const data = otpDoc.data();
      const now = new Date();
      const expiresAt = data.expiresAt.toDate();

      // Check if expired
      if (now > expiresAt) {
        await deleteDoc(doc(db, 'otps', userId));
        return false;
      }

      // Check attempts (max 3)
      if (data.attempts >= 3) {
        await deleteDoc(doc(db, 'otps', userId));
        return false;
      }

      // Verify code
      if (data.code === inputOTP) {
        await deleteDoc(doc(db, 'otps', userId));
        return true;
      } else {
        // Increment attempts
        await setDoc(
          doc(db, 'otps', userId),
          { attempts: data.attempts + 1 },
          { merge: true }
        );
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  },

  // Send OTP via email using EmailJS (FREE - 200 emails/month)
  async sendOTPEmail(email: string, otp: string): Promise<void> {
    // Check if EmailJS is configured
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      throw new Error('Email service is not configured. Please contact administrator.');
    }

    try {
      const templateParams = {
        email: email,  // Must match {{email}} in template
        to_name: email.split('@')[0],
        otp_code: otp,
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      if (import.meta.env.DEV) {
        console.log('✅ OTP email sent successfully to:', email.replace(/(.{3}).*(@.*)/, '$1***$2'));
      }
    } catch (error) {
      console.error('❌ Failed to send OTP email');
      throw new Error('Failed to send verification code. Please try again.');
    }
  },

  // Check if user has 2FA enabled
  async is2FAEnabled(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;
      
      const data = userDoc.data();
      return data.twoFactorEnabled === true;
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      return false;
    }
  },

  // Enable 2FA for user
  async enable2FA(userId: string): Promise<void> {
    await setDoc(
      doc(db, 'users', userId),
      { twoFactorEnabled: true, updatedAt: Timestamp.now() },
      { merge: true }
    );
  },

  // Disable 2FA for user
  async disable2FA(userId: string): Promise<void> {
    await setDoc(
      doc(db, 'users', userId),
      { twoFactorEnabled: false, updatedAt: Timestamp.now() },
      { merge: true }
    );
  },
};
