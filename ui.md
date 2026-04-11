# PAWZZ — Technical Architecture Master Prompt

You are a principal backend engineer and cloud architect. Your task is to design and generate the complete, production-grade technical architecture for **PAWZZ** — a veterinary and pet-care platform that connects vet clinics, NGOs, service providers, volunteers, and administrators.

Treat this as a real production system targeting **10,000 concurrent users at MVP**, with clean room to scale further without a rewrite. Every decision must be justified, secure, and maintainable.

---

## STACK — NON-NEGOTIABLE

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Backend | Node.js 20+, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Auth | Google OAuth 2.0, JWT (HTTP-only cookies only) |
| File Storage | MongoDB GridFS (audio blobs — NO S3) |
| AI Processing | OpenAI Whisper API (via Worker Threads — NOT on main thread) |
| Payments | Razorpay (checkout modal + server webhook) |
| Validation | Zod (backend), React Hook Form + Zod (frontend) |
| Security | helmet, cors, express-rate-limit, crypto (HMAC) |
| Deployment | Vercel (frontend), AWS EC2 or Render (backend), MongoDB Atlas M10+ |

Do NOT substitute any of the above with alternatives unless it is a pure utility (e.g., lodash, dayjs). Do not use Prisma, PostgreSQL, Firebase, Supabase, or any other ORM/database.

---

## 1. BACKEND PROJECT STRUCTURE

Generate the exact folder and file tree. Every file must have a clear single responsibility.

```
backend/
├── server.js                          # Entry point, app bootstrap
├── app.js                             # Express app setup (middleware stack)
├── config/
│   ├── db.js                          # MongoDB Atlas connection with retry logic
│   ├── gridfs.js                      # GridFS bucket initialization
│   └── env.js                         # Centralized env var validation (fail fast on missing vars)
├── controllers/
│   ├── authController.js              # Google token verify → JWT set
│   ├── directoryController.js         # Listing CRUD + search + filter
│   ├── bookingController.js           # Slot fetch + atomic booking write
│   ├── volunteerController.js         # Form submit + audio stream to GridFS
│   ├── paymentController.js           # Razorpay order creation
│   └── adminController.js            # Moderation actions
├── routes/
│   ├── auth.js
│   ├── directory.js
│   ├── booking.js
│   ├── volunteer.js
│   ├── payment.js
│   ├── webhook.js                     # Razorpay webhook — isolated route file
│   └── admin.js
├── models/
│   ├── User.js
│   ├── Listing.js
│   ├── Booking.js
│   └── VolunteerSubmission.js
├── middlewares/
│   ├── authMiddleware.js              # Parse JWT from HTTP-only cookie
│   ├── requireRole.js                 # RBAC — requireRole(['Admin'])
│   ├── validate.js                    # Zod schema runner middleware
│   ├── rateLimiter.js                 # Per-route rate limiters
│   └── errorHandler.js               # Centralized error normalization
├── services/
│   ├── authService.js                 # google-auth-library verify logic
│   ├── gridfsService.js               # Upload/stream/delete from GridFS
│   ├── whisperService.js              # Whisper API call wrapper
│   └── razorpayService.js             # Order create + signature verify
├── workers/
│   └── transcriptionWorker.js         # Worker Thread — Whisper async pipeline
├── validators/
│   ├── authValidator.js
│   ├── bookingValidator.js
│   ├── volunteerValidator.js
│   └── adminValidator.js
└── utils/
    ├── jwtUtils.js                    # sign / verify / decode JWT
    ├── responseHelper.js              # Standardized success/error response shapes
    └── logger.js                      # Structured console logger (prod-safe)
```

---

## 2. MONGODB SCHEMAS — IMPLEMENT EXACTLY

### User Model
```js
{
  email:   { type: String, required: true, unique: true, match: /regex/ },
  role:    { type: String, enum: ['Vet Clinic','NGO','Service Provider','Volunteer / City Lead','Admin'], required: true },
  profile: {
    name:   String,
    phone:  String,
    avatar: String
  },
  timestamps: true
}
// Indexes: email (unique), role
```

### Listing Model
```js
{
  ownerId:             { type: ObjectId, ref: 'User' },
  type:                { type: String, enum: ['clinic','ngo','service'], required: true },
  name:                { type: String, required: true },
  location: {
    address:  String,
    city:     String,
    coords:   { type: { type: String, default: 'Point' }, coordinates: [Number] }
  },
  services:            [String],
  phone:               String,
  email:               String,
  verification_status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  timestamps: true
}
// Indexes: verification_status, location.coords (2dsphere for future geo search), type
```

### Booking Model
```js
{
  userId:     { type: ObjectId, ref: 'User', required: true },
  providerId: { type: ObjectId, ref: 'Listing', required: true },
  time_slot:  { type: Date, required: true },
  status:     { type: String, enum: ['available','pending','confirmed','cancelled'], default: 'available' },
  paymentRef: { type: String, default: null },
  timestamps: true
}
// Compound index: { providerId: 1, time_slot: 1, status: 1 } — critical for atomic query
```

### VolunteerSubmission Model
```js
{
  userId:     { type: ObjectId, ref: 'User', required: true },
  formData: {
    fullName:       String,
    email:          String,
    areaOfInterest: String
  },
  audio_url:    { type: String, required: true },  // GridFS file ObjectId as string
  transcript:   { type: String, default: null },
  status:       { type: String, enum: ['pending review','accepted','rejected'], default: 'pending review' },
  processingError: { type: String, default: null },
  timestamps: true
}
```

---

## 3. AUTH FLOW — IMPLEMENT EXACTLY

**POST /auth/login**
1. Receive `{ idToken }` from frontend (Google OAuth token)
2. Verify using `google-auth-library` OAuth2Client.verifyIdToken()
3. Extract `email`, `name`, `picture` from payload
4. findOneAndUpdate User in MongoDB (upsert: true)
5. Sign JWT: `{ _id, email, role }` — expires in 7d
6. Set cookie: `httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7*24*60*60*1000`
7. Return `{ user: { name, email, role, avatar } }` — never return the JWT in body

**authMiddleware.js**
- Read cookie named `pawzz_token`
- Verify with jwtUtils.verify()
- Attach `req.user = decoded`
- On error: 401 with `{ error: 'Unauthorized' }`

**requireRole.js**
```js
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```
- Always apply BEFORE touching the database — never after

---

## 4. BOOKING — ATOMIC CONCURRENCY (MISSION CRITICAL)

**GET /availability?providerId=&date=**
- Query Booking where `{ providerId, time_slot: { $gte: startOfDay, $lte: endOfDay }, status: 'available' }`
- Return slot array with status

**POST /book**

Zod validate: `{ providerId, timeSlot }` — reject malformed dates immediately

```js
// ATOMIC WRITE — do not simplify or change this pattern
const booking = await Booking.findOneAndUpdate(
  {
    providerId: req.body.providerId,
    time_slot:  new Date(req.body.timeSlot),
    status:     'available'
  },
  { $set: { status: 'pending', userId: req.user._id } },
  { new: true }
);

if (!booking) {
  return res.status(409).json({
    error: 'SLOT_TAKEN',
    message: 'This slot was just booked. Please select another.'
  });
}

return res.status(200).json({ booking });
```

Rules:
- Never use two separate find + update calls — race condition
- Return 409 on conflict, not 500
- Booking status flow: `available → pending → confirmed → cancelled`
- Do not mark confirmed until Razorpay webhook verifies

---

## 5. VOLUNTEER AUDIO PIPELINE

**POST /volunteer** (multipart/form-data)

Multer config:
```js
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => ({
    bucketName: 'audioUploads',
    filename: `volunteer_${Date.now()}_${file.originalname}`
  })
});
// Limits: fileSize: 20MB, mimeTypes: ['audio/webm','audio/mp4','audio/ogg','audio/wav']
```

Flow:
1. Validate form fields with Zod (fullName, email, areaOfInterest)
2. Validate file: type + size
3. Stream directly into GridFS via multer-gridfs-storage
4. Save VolunteerSubmission doc with `audio_url = gridfsFile.id.toString()`
5. **Immediately return `202 Accepted`** — do NOT await transcription
6. Spawn Worker Thread passing `{ submissionId, gridfsFileId }`

**transcriptionWorker.js (Worker Thread)**
```js
// runs in isolated thread — never blocks Express event loop
parentPort.on('message', async ({ submissionId, gridfsFileId }) => {
  try {
    const audioBuffer = await gridfsService.readFile(gridfsFileId);
    const transcript  = await whisperService.transcribe(audioBuffer);
    await VolunteerSubmission.findByIdAndUpdate(submissionId, { transcript });
  } catch (err) {
    await VolunteerSubmission.findByIdAndUpdate(submissionId, {
      processingError: err.message
    });
  }
});
```

Rules:
- Worker must have its own MongoDB connection
- Worker crash must NOT crash Express
- processingError field must be set on failure — admin can see it
- Never await worker from main thread

---

## 6. RAZORPAY PAYMENT FLOW

**POST /payment/create-order**
```js
const order = await razorpay.orders.create({
  amount:   booking.amount * 100,  // paise
  currency: 'INR',
  receipt:  `receipt_${bookingId}`
});
// Return { orderId, amount, currency, key: process.env.RAZORPAY_KEY_ID }
```

**POST /webhook/razorpay**
```js
// CRITICAL — must use raw body, not parsed JSON
app.use('/webhook/razorpay', express.raw({ type: 'application/json' }));

const expectedSig = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(req.body)
  .digest('hex');

if (expectedSig !== req.headers['x-razorpay-signature']) {
  logger.warn('Invalid Razorpay signature attempt');
  return res.status(400).json({ error: 'Invalid signature' });
}

// Only now update booking status
await Booking.findOneAndUpdate(
  { paymentRef: payload.payment.entity.order_id },
  { $set: { status: 'confirmed' } }
);
```

Rules:
- Webhook endpoint must be idempotent — duplicate events must not double-confirm
- Never confirm booking from frontend — only from verified webhook
- Log invalid signatures without exposing secret

---

## 7. SECURITY MIDDLEWARE STACK

Apply in this exact order in `app.js`:

```js
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true,              // required for HTTP-only cookies
  methods:     ['GET','POST','PUT','PATCH','DELETE']
}));
app.use(express.json({ limit: '10kb' }));  // body size limit

// Rate limiters — per route category
const authLimiter    = rateLimit({ windowMs: 15*60*1000, max: 20 });
const bookingLimiter = rateLimit({ windowMs: 60*1000,    max: 10 });
const globalLimiter  = rateLimit({ windowMs: 60*1000,    max: 100 });

app.use('/auth',    authLimiter);
app.use('/book',    bookingLimiter);
app.use(globalLimiter);

// Mount routes
app.use('/auth',      authRoutes);
app.use('/directory', directoryRoutes);
app.use('/book',      bookingRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/admin',     adminRoutes);
app.use('/webhook',   webhookRoutes);

// Centralized error handler — always last
app.use(errorHandler);
```

---

## 8. STANDARDIZED API RESPONSE SHAPE

Every single endpoint must use this format. No exceptions.

```js
// Success
{
  "success": true,
  "data": { ... },
  "message": "Booking confirmed"
}

// Error
{
  "success": false,
  "error": "SLOT_TAKEN",
  "message": "Human-readable reason",
  "fields": [{ "field": "email", "message": "Invalid email" }]  // only for 400s
}
```

Error status code map:
- `400` — Validation failure
- `401` — Unauthenticated
- `403` — RBAC forbidden
- `404` — Resource not found
- `409` — Conflict (double booking)
- `500` — Internal server error (never expose stack in production)

---

## 9. ENVIRONMENT VARIABLES

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pawzz
JWT_SECRET=minimum_32_char_random_string
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx
RAZORPAY_WEBHOOK_SECRET=xxxx

WHISPER_API_KEY=sk-xxxx
FRONTEND_URL=https://pawzz.in
NODE_ENV=production
```

Validate all vars at startup in `config/env.js` — if any are missing, throw and crash immediately with a clear message. Never let the server start silently misconfigured.

---

## 10. PERFORMANCE & INDEXING RULES

- All lookup fields must be indexed: `email`, `role`, `verification_status`, `time_slot`, `status`, `providerId`
- Compound index on Booking: `{ providerId, time_slot, status }` — this is the atomic query index
- 2dsphere index on `location.coords` for future geo search
- Use `.lean()` on read-only queries that don't need Mongoose document methods
- Never query inside a loop — use `$in` and populate efficiently
- Target <200ms p95 response time on indexed queries

---

## OUTPUT FORMAT

Generate in this order:
1. `app.js` — full middleware stack
2. `config/db.js` — MongoDB connection with retry
3. All 4 models with indexes
4. All controllers (thin — call services)
5. All services (business logic)
6. All route files
7. All middleware files
8. `workers/transcriptionWorker.js`
9. `validators/` — Zod schemas for each route
10. `utils/responseHelper.js` and `utils/jwtUtils.js`
11. `.env.example`

Do not skip any file. Do not simplify the atomic booking logic. Do not move webhook verification outside the webhook route.
