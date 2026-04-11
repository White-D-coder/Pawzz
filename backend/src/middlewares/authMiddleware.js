import { verifyToken } from '../utils/jwtUtils.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.pawzz_token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    next();
  };
};
