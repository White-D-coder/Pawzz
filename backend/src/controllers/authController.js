import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwtUtils.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, picture } = ticket.getPayload();
    
    // Upsert User
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        profile: { name, avatar: picture }
      });
    }
    
    // Generate JWT
    const jwtToken = signToken({ id: user._id, email: user.email, role: user.role });
    
    // Set HttpOnly Cookie
    res.cookie('pawzz_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('pawzz_token');
  res.status(200).json({ success: true, message: 'Logged out' });
};
