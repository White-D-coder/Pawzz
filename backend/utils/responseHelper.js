/**
 * Standardized Success Response
 */
export const sendSuccess = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message
  });
};

/**
 * Standardized Error Response
 */
export const sendError = (res, error, message = 'An error occurred', status = 500, fields = []) => {
  return res.status(status).json({
    success: false,
    error,
    message,
    ...(fields.length > 0 && { fields })
  });
};
