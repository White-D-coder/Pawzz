import { verifyToken } from '../utils/jwtUtils.js';
import { sendError } from '../utils/responseHelper.js';

/**
 * Protect routes - Verification of HttpOnly Session Cookie
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.pawzz_token;
    
    if (!token) {
      return sendError(res, 'UNAUTHORIZED', 'Session expired. Please login again.', 401);
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired session', 401);
  }
};

/**
 * RBAC Restriction - Ensures user has one of the allowed roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'FORBIDDEN', `Access denied: Role '${req.user.role}' not authorized`, 403);
    }
    next();
  };
};

