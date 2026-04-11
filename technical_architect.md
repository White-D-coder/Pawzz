# 🏗️ PAWZZ | Technical Architecture & System Blueprint

## 2. AUTHENTICATION & AUTHORIZATION (OAuth 2.0 & RBAC)
* **Frontend Login Modal**: Centered modal with dark overlay (bg-black/50 backdrop-blur-sm). Modal card (bg-white rounded-xl shadow-2xl p-8). "Continue with Google" button with official G-logo.
* **Backend Auth Flow (POST /auth/login)**: Receive Google OAuth 2.0 token. Verify using `google-auth-library`.
* **Session Management**: Generate secure JWT (contains _id, email, role). Set in HTTP-only, Secure, SameSite=Strict cookie.
* **Role-Based Access Control (RBAC)**: Roles: Vet Clinic, NGO, Service Provider, Volunteer / City Lead, Admin. Middleware `requireRole(['Admin'])` blocks unauthorized access with 403 Forbidden.

## 3. DIRECTORY SYSTEM (SEO & DATA FETCHING)
* **Next.js SSR Implementation**: Utilize SSR for listing data pre-rendering. Fetch initial data server-side, client-side hydration for filtering.
* **Hero & Search Filters**: full-width hero (bg-teal-50). Search console (bg-white rounded-xl shadow-lg p-4). Location Input, Category Dropdown, Services Filter.
* **Listing Card UI**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3. h-48 w-full image. Badge for NGO/Clinic. border-t border-gray-100 bg-gray-50 footer.
* **Data Masking (Access Control)**: Public users see limited data (Name, Category, Location). Hide phone, address, and email for `!isAuthenticated`.

## 4. BOOKING SYSTEM & ATOMIC CONCURRENCY
* **Frontend Booking Modal**: Step 1 (Date Selection), Step 2 (Time Slot Selection - grid-cols-3), Step 3 (Confirmation).
* **Backend Concurrency Logic (POST /book)**: Use atomic database operations. Use `findOneAndUpdate` with query filter: `{ providerId: ID, timeSlot: exactTime, status: 'available' }`. Return 409 Conflict if modified by another user.
* **State Management**: pending, confirmed, or cancelled.

## 5. VOLUNTEER SYSTEM: CUSTOM AUDIO PIPELINE & WORKER THREADS
* **Frontend UI**: React Hook Form validation. Voice Recording Component (MediaRecorder API). Timer (00:00). HTML5 `<audio controls>` preview.
* **Backend Storage (MongoDB GridFS)**: Handle file uploads via Multer. Stream raw audio Blob into MongoDB GridFS bucket. Save GridFS file ID as audio URL.
* **Asynchronous AI Transcription (Worker Threads)**: Whisper for speech-to-text. Use native Node.js Worker Thread. Endpoint responds with 202 Accepted immediately. Worker thread updates document with transcript.

## 6. SECURE ADMIN PANEL & MODERATION WORKFLOW
* **Layout**: Fullscreen layout. Sidebar (w-64 bg-gray-900). Content area (bg-gray-50).
* **Volunteer Review (GET /admin/volunteers)**: Data table with Review modal. Render HTML5 `<audio>` from GridFS. Render read-only text area for AI transcript. "Accept" (bg-emerald-500) and "Reject" (bg-red-500) buttons.
* **Listing Approval (PATCH /admin/approve)**: Queue of new clinic/NGO signups with verification status.

## 7. PAYMENT GATEWAY INTEGRATION
* **Integration**: Razorpay API.
* **Workflow**: Frontend initializes Razorpay checkout modal.
* **Backend Webhook**: Verify webhook signature using crypto module (HMAC SHA256). Update status only upon verified receipt.

## 8. STRICT DATA MODELS (MongoDB Atlas / Mongoose)
* **Users**: email, role (enum), profile (nested object name/phone/avatar).
* **Listings**: type (enum clinic/ngo/service), location (GeoJSON), services (Array), verification_status (enum).
* **Bookings**: userId, providerId, time_slot (Date, indexed), status (enum).
* **Volunteer Submissions**: userId, audio_url (GridFS ID), transcript, status (enum).

## 9. SECURITY & NON-FUNCTIONAL REQUIREMENTS
* **Dual-Layer Validation**: Zod or Joi on backend. 400 Bad Request for failures.
* **API Security**: helmet, cors (strict), express-rate-limit.
* **Performance**: <200ms latency goal. Heavy indexing on email, role, location, and time_slot.
* **Deployment**: Next.js (Vercel), Backend (AWS/Render), DB (MongoDB Atlas).
