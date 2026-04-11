import { User } from '../models/User.js';
import { verifyGoogleToken } from '../services/authService.js';
import { signToken } from '../utils/jwtUtils.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Handle Google Login / Registration
 */
export const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    
    if (!token) {
      return sendError(res, 'MISSING_TOKEN', 'Google token is required', 400);
    }

    // 1. Verify Google Token
    const payload = await verifyGoogleToken(token);
    const { email, name, picture } = payload;

    // 2. Upsert User (Update existing or create new with role)
    let user = await User.findOne({ email });
    
    if (!user) {
      // New User - require role selection
      if (!role) {
        return sendError(res, 'ROLE_REQUIRED', 'Role selection is required for new accounts', 400);
      }
      user = await User.create({
        email,
        role,
        profile: { name, avatar: picture }
      });
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
