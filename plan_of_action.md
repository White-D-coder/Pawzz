# 🚀 PAWZZ | Final Plan of Action (Developer Blueprint)

## 🎯 Project Objective
Build a production-grade pet care ecosystem connecting Clinics, NGOs, and Volunteers with atomic integrity, AI-driven workflows, and a premium "White Cloud" aesthetic.

---

## 🛠️ Phase 1: Environment & Design System (Days 1-2)
- **Goal**: Establish the theme and component library.
- [ ] Initialize **Next.js 14** (Frontend) & **Express** (Backend) monorepo.
- [ ] **Tailwind Configuration**: 
  - Colors: `teal-700` (#0F766E), `amber-500` (#F59E0B), `gray-50` (#F9FAFB).
  - Fonts: **Inter** (Primary), **Plus Jakarta Sans** (Refined Headings).
- [ ] **Atomic UI Development**:
  - `Button`: Primary, Secondary, Danger, Loading (SVG Spin).
  - `Inputs`: Custom styles for focus/error states.
  - `Surface`: 2xl rounded cards with standard `--shadow-sm`.
- [ ] **Global Navbar**: Responsive sticky header with avatar dropdowns and "Login with Google".

---

## 🔐 Phase 2: Secure Core & Auth (Days 3-4)
- **Goal**: Implement OAuth 2.0 with RBAC.
- [ ] **Google OAuth**: Integrate `google-auth-library` and NextAuth or custom JWT.
- [ ] **JWT in HttpOnly Cookies**: Strict cookie-based session management (SameSite=Strict).
- [ ] **RBAC Middleware**: `requireRole(['Admin', 'Vet Clinic', ...])` implementation.
- [ ] **Audit Trail**: Basic logging for all sensitive auth actions.

---

## 📂 Phase 3: Directory System & SEO (Days 5-6)
- **Goal**: High-performance searchable listings.
- [ ] **Next.js SSR**: Pre-render listings for SEO.
- [ ] **Search Console**: Global search with Location (GeoJSON) and Category filters.
- [ ] **Data Masking Layer**: Logic to blur contact details for unauthenticated users.
- [ ] **Listing Grid**: Fully responsive layout from mobile to 4K displays.

---

## 📅 Phase 4: Atomic Booking & Payments (Days 7-9)
- **Goal**: Prevent double-booking and handle transactions.
- [ ] **Availability Engine**: Generate slots and handle `FIND_AND_UPDATE` atomic locks.
- [ ] **Booking Flow**: 3-step modal (Calendar -> Slots -> Confirm).
- [ ] **Razorpay Integration**: Frontend Checkout + Backend Secure Webhook verification.
- [ ] **Race Condition Testing**: Simulated load testing for slot selection.

---

## 🎙️ Phase 5: Voice Volunteer Pipeline (Days 10-12)
- **Goal**: Seamless audio application workflow.
- [ ] **MediaRecorder UI**: Recording/Stop/Timer system with pulse animations.
- [ ] **GridFS Storage**: Stream binary audio data directly into MongoDB.
- [ ] **AI Worker Threads**: Instantiate Node.js `worker_threads` for Whisper API speech-to-text.
- [ ] **Review Interface**: Markdown-enriched transcriptions for Admin review.

---

## 🛡️ Phase 6: Admin Moderation & Polish (Days 13-14)
- **Goal**: Moderation dashboard and UX refinement.
- [ ] **Admin Sidebar**: Central hub for Volunteers, Listings, and Booking management.
- [ ] **Moderation Workflow**: Approve/Reject queue for newly registered clinics/NGOs.
- [ ] **Global Loading/Error Handling**:
  - Skeleton loaders for all cards.
  - Success/Conflict toast notifications.
  - Responsive "Sad Paw" empty states.
- [ ] **Deployment**: Vercel (Frontend) + Render/Heroku (Backend) + MongoDB Atlas.

---

## 📝 Critical Constraints Reminder
- **No Local Storage**: JWTs must remain in cookies.
- **No Main Thread Blocking**: AI processing stays in worker threads.
- **Atomic Writes**: Booking slots must never overlap.
- **SEO Priority**: Directory pages must remain server-side rendered.
