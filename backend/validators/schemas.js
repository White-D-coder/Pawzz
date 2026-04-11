import { z } from 'zod';
import { sendError } from '../utils/responseHelper.js';

/**
 * Validation Middleware
 * Validates request body/query/params against a Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return sendError(res, 'VALIDATION_ERROR', message, 400);
  }
};

/**
 * Common Schemas
 */
export const listingSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 chars"),
    type: z.enum(['Clinic', 'NGO']),
    address: z.string(),
    contact: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    location: z.object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2)
    })
  })
});

export const bookingSchema = z.object({
  body: z.object({
    listingId: z.string().length(24, "Invalid ID"),
    slotDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
    slotTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time (HH:mm)")
  })
});
