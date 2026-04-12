import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { AdminWhitelist } from '../models/AdminWhitelist.js';
import { verifyGoogleToken } from '../services/authService.js';
import { signToken } from '../utils/jwtUtils.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    
    // 1. Handle Mock Bypass for Development
    if (token === 'mock_token_bypass' && process.env.NODE_ENV === 'development') {
      const mockEmail = `test_${(role || 'parent').replace(/\s+/g, '').toLowerCase()}@example.com`;
      
      // Check if whitelisted in DB
      const isWhitelisted = await AdminWhitelist.findOne({ email: mockEmail.toLowerCase() });
      const isAdminByEmail = isWhitelisted || mockEmail === 'deeptanu.bhunia@adypu.edu.in';
      
      const mockUser = { 
        email: mockEmail, 
        role: isAdminByEmail ? 'Admin' : role,
        isApproved: (role === 'Pet Parent' || isAdminByEmail),
        requestedRole: (role !== 'Pet Parent' && !isAdminByEmail) ? role : null,
        profile: { name: `Test ${role || 'User'}`, avatar: 'https://i.pravatar.cc/150' } 
      };

      // Upsert mock user in DB for approval testing
      let user = await User.findOneAndUpdate(
        { email: mockEmail },
        mockUser,
        { upsert: true, new: true }
      );

      const jwtToken = signToken({ id: user._id, email: user.email, role: user.role });
      res.cookie('pawzz_token', jwtToken, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

      return sendSuccess(res, { user }, 'Authentication successful (BYPASS MODE)');
    }

    // 2. Verify Google Token
    const payload = await verifyGoogleToken(token);
    const { email, name, picture } = payload;

    // 3. Upsert User (Update existing or create new with role)
    let user = await User.findOne({ email });
    
    // Check if whitelisted in DB (Enforce Admin role for these emails)
    const isWhitelisted = await AdminWhitelist.findOne({ email: email.toLowerCase() });
    const isAdminWhitelisted = isWhitelisted || email === 'deeptanu.bhunia@adypu.edu.in';

    if (!user) {
      if (!role) {
        return sendError(res, 'ROLE_REQUIRED', 'Role selection is required for new accounts', 400);
      }

      let finalRole = 'Pet Parent';
      let approved = false;
      let currentStatus = 'pending';

      if (role === 'Admin' && isAdminWhitelisted) {
        finalRole = 'Admin';
        approved = true;
        currentStatus = 'active';
      } else if (role === 'Pet Parent') {
        finalRole = 'Pet Parent';
        approved = true;
        currentStatus = 'active';
      } else {
        // Professional Roles starts as Pet Parent with a request
        finalRole = 'Pet Parent'; 
        approved = false;
        currentStatus = 'pending';
      }

      user = await User.create({
        email,
        role: finalRole,
        isApproved: approved,
        status: currentStatus,
        requestedRole: (role !== 'Pet Parent') ? role : null,
        profile: { name, avatar: picture }
      });
    } else {
      // Existing User: If they are whitelisted as admin but role is not Admin, promote them automatically
      if (isAdminWhitelisted && user.role !== 'Admin') {
        user.role = 'Admin';
        user.isApproved = true;
        await user.save();
        console.log(`⭐ Existing user ${email} promoted to Admin via whitelist.`);
      }
    }

    // 3. Generate JWT
    const jwtToken = signToken({ id: user._id, email: user.email, role: user.role });

    // 4. Set HttpOnly Cookie
    res.cookie('pawzz_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    }, 'Authentication successful');

  } catch (error) {
    if (error.message === 'INVALID_GOOGLE_TOKEN') {
      return sendError(res, 'INVALID_TOKEN', 'The provided Google token is invalid', 401);
    }
    console.error('❌ Login Controller Error:', error);
    return sendError(res, 'AUTH_ERROR', 'An error occurred during authentication', 500);
  }
};

/**
 * Fetch Current Session
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'USER_NOT_FOUND', 'User no longer exists', 404);
    }
    
    return sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch session', 500);
  }
};

/**
 * Clear Session
 */
export const logout = (req, res) => {
  res.clearCookie('pawzz_token');
  return sendSuccess(res, null, 'Logged out successfully');
};
