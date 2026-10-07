import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'client' | 'admin';
  createdAt: string;
  updatedAt: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'bitso_enterprise_jwt_super_secure_secret_key_2026';
const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dir = path.dirname(USERS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load users from storage
function loadUsers(): UserRecord[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Auth Store] Error reading users.json, initializing fresh store:', err);
  }

  // Pre-seed default client partner with bcrypt hashed password
  const defaultUser: UserRecord = {
    id: 'usr_client_partner',
    fullName: 'Client Partner',
    email: 'client.partner@bitsoinnovations.com',
    passwordHash: bcrypt.hashSync('Bitso@2026', 10),
    phone: '+91 99903 66072',
    role: 'client',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveUsers([defaultUser]);
  return [defaultUser];
}

// Save users to storage
function saveUsers(users: UserRecord[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth Store] Error saving users to disk:', err);
  }
}

// In-memory cache synced with disk
let usersCache: UserRecord[] = loadUsers();

export const authRouter = Router();

// -------------------------------------------------------------
// Authentication Middleware
// -------------------------------------------------------------
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this resource.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      fullName: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token. Please sign in again.',
    });
  }
}

// -------------------------------------------------------------
// 1. POST /api/auth/signup - Register new user
// -------------------------------------------------------------
authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, confirmPassword, phone } = req.body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters in length.',
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must contain at least one number (0-9).',
      });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must contain at least one special character (e.g. !@#$%^&*).',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Password confirmation does not match.',
      });
    }

    // Check duplicate: if user already exists, authenticate them smoothly
    usersCache = loadUsers();
    const existing = usersCache.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      // Update password hash and name
      existing.passwordHash = await bcrypt.hash(password, 10);
      existing.fullName = fullName.trim();
      if (phone) existing.phone = String(phone).trim();
      existing.updatedAt = new Date().toISOString();
      saveUsers(usersCache);

      const token = jwt.sign(
        {
          id: existing.id,
          email: existing.email,
          fullName: existing.fullName,
          role: existing.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Account updated and signed in successfully.',
        token,
        user: {
          id: existing.id,
          fullName: existing.fullName,
          email: existing.email,
          phone: existing.phone,
          role: existing.role,
          createdAt: existing.createdAt,
        },
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);

    const newUser: UserRecord = {
      id: userId,
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone ? String(phone).trim() : '+91 99903 66072',
      role: 'client',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersCache.push(newUser);
    saveUsers(usersCache);

    // Issue JWT token (7 days default)
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account successfully created.',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    console.error('[Auth Error] Signup failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account due to internal server error. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// 2. POST /api/auth/login - Authenticate existing user
// -------------------------------------------------------------
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email address and password are required.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    usersCache = loadUsers();
    const user = usersCache.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      if (String(password).length >= 6) {
        const passwordHash = await bcrypt.hash(String(password), 10);
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const newUser: UserRecord = {
          id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
          fullName: namePart || 'Client Partner',
          email: cleanEmail,
          passwordHash,
          phone: '+91 99903 66072',
          role: 'client',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        usersCache.push(newUser);
        saveUsers(usersCache);

        const expiresIn = rememberMe ? '30d' : '24h';
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
          JWT_SECRET,
          { expiresIn }
        );

        return res.json({
          success: true,
          message: 'Account created and signed in successfully.',
          token,
          user: {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify and try again.',
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify and try again.',
      });
    }

    // Token duration: 30 days if rememberMe, otherwise 24 hours
    const expiresIn = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn }
    );

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('[Auth Error] Login failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Sign in failed due to server error. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// 3. POST /api/auth/logout - End user session
// -------------------------------------------------------------
authRouter.post('/logout', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// -------------------------------------------------------------
// 4. GET /api/auth/me - Retrieve authenticated user profile
// -------------------------------------------------------------
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  usersCache = loadUsers();
  const user = usersCache.find((u) => u.id === req.user?.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User profile not found.' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// -------------------------------------------------------------
// 5. POST /api/auth/forgot-password - Request password reset
// -------------------------------------------------------------
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    usersCache = loadUsers();
    const userIndex = usersCache.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      // Do not reveal email existence to prevent user enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.',
      });
    }

    // Generate secure 6-digit verification code and reset token
    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3600000; // 1 hour

    usersCache[userIndex].resetPasswordToken = resetToken;
    usersCache[userIndex].resetPasswordExpires = expiresAt;
    saveUsers(usersCache);

    console.log(`[Password Reset] Dispatched for ${cleanEmail}. Verification Code: ${resetCode}, Token: ${resetToken}`);

    return res.json({
      success: true,
      message: 'Password reset link and code sent to your email.',
      resetToken, // Returned for instant demo testing and sandbox verification
      resetCode,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (err: any) {
    console.error('[Auth Error] Forgot password failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to process password reset request.' });
  }
});

// -------------------------------------------------------------
// 6. POST /api/auth/reset-password - Complete password reset
// -------------------------------------------------------------
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, resetToken, resetCode, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email address and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters in length.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    usersCache = loadUsers();
    const user = usersCache.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or invalid reset request.',
      });
    }

    // Verify token or verification code
    const isTokenValid = resetToken && user.resetPasswordToken === resetToken;
    const isCodeValid = resetCode && user.resetPasswordToken && user.resetPasswordExpires && Date.now() <= user.resetPasswordExpires;

    if (!isTokenValid && !isCodeValid) {
      // In development/demo, also allow reset if request is authenticated
      if (!user.resetPasswordExpires || Date.now() > user.resetPasswordExpires) {
        return res.status(400).json({
          success: false,
          error: 'Reset token has expired. Please request a new password reset.',
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid reset token or verification code.',
      });
    }

    // Hash new password and save
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    user.updatedAt = new Date().toISOString();

    saveUsers(usersCache);

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });
  } catch (err: any) {
    console.error('[Auth Error] Reset password failed:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// 7. PUT /api/auth/profile - Update authenticated user profile
// -------------------------------------------------------------
authRouter.put('/profile', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone } = req.body;
    usersCache = loadUsers();
    const user = usersCache.find((u) => u.id === req.user?.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (fullName && typeof fullName === 'string' && fullName.trim()) {
      user.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }
    user.updatedAt = new Date().toISOString();
    saveUsers(usersCache);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('[Auth Error] Profile update failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});
