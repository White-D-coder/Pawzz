# PAWZZ — UI & Frontend Master Prompt

You are a senior frontend engineer and UI designer. Your task is to build the complete, production-ready frontend for **PAWZZ** — a veterinary and pet-care platform. The UI must feel warm, modern, trustworthy, and emotionally resonant — designed for pet lovers and professional care providers alike.

This is NOT a demo. Every component must be reusable, accessible, responsive, and handle all async states: loading, success, error, empty, conflict, and unauthorized.

---

## STACK — NON-NEGOTIABLE

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Pages, SSR, routing |
| TypeScript | All files `.tsx` / `.ts` |
| Tailwind CSS | All styling — no CSS modules, no styled-components |
| `next/font/google` | Font loading — Plus Jakarta Sans only |
| React Hook Form + Zod | All forms — no uncontrolled inputs |
| Axios | API calls — centralized instance in `/lib/api.ts` |
| React Context | Auth state only |

---

## BRAND IDENTITY

**Name:** PAWZZ
**Tagline:** Connecting Pet Care, Together.
**Feel:** Warm · Trustworthy · Clean · Slightly playful · Professional

### Logo Mark
- Wordmark: `PAWZZ` in `font-weight: 800`, color `#005F73`
- Prefix: small paw-print SVG icon in `#0A9396` to the left of the wordmark
- Never stylize or distort the wordmark

---

## COLOR PALETTE — USE ONLY THESE VALUES

```js
// tailwind.config.ts
colors: {
  brand: {
    sky:    '#005F73',   // primary dark — headings, sidebar, anchor color
    teal:   '#0A9396',   // primary action — CTAs, nav active, icons, borders
    sun:    '#EE9B00',   // accent — secondary CTA, badges, hover highlight
    cloud:  '#FFF9F4',   // global page background
  }
}
```

| Token | Hex | Usage |
|---|---|---|
| `brand-sky` | `#005F73` | Headings, sidebar bg, dark text on light surfaces |
| `brand-teal` | `#0A9396` | Buttons, nav active, icons, input focus rings |
| `brand-sun` | `#EE9B00` | Accent buttons, NGO/animal badges, hover states |
| `brand-cloud` | `#FFF9F4` | Global `<body>` background |
| White | `#FFFFFF` | Cards, modals, inputs |
| Border | `#E5E7EB` | Card borders, dividers, input borders |
| Text heading | `#0D2B2E` | All h1–h3 |
| Text body | `#4B5563` | Paragraphs, descriptions |
| Text muted | `#9CA3AF` | Placeholders, helper text, disabled labels |
| Success | `#10B981` | Confirmed states, accept badges |
| Error | `#EF4444` | Rejected, form errors, conflict toasts |

**Teal tint surface:** `#EEF9F9` — used for hero bg, section alternates, hovered nav items

---

## TYPOGRAPHY

**Font:** `Plus Jakarta Sans` — load via `next/font/google`

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';
const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400','500','600','700','800'],
  variable: '--font-pawzz'
});
```

| Element | Tailwind classes |
|---|---|
| `h1` Page title | `text-4xl font-bold tracking-tight text-[#0D2B2E]` |
| `h2` Section heading | `text-2xl font-bold text-[#0D2B2E]` |
| `h3` Card title | `text-lg font-semibold text-[#0D2B2E]` |
| Body | `text-base font-normal leading-relaxed text-[#4B5563]` |
| Label | `text-sm font-medium text-[#4B5563]` |
| Caption / helper | `text-xs text-[#9CA3AF]` |
| Badge text | `text-xs font-medium` |

---

## GLOBAL LAYOUT RULES

- Body bg: `bg-[#FFF9F4]`
- Cards: `bg-white rounded-2xl shadow-sm border border-[#E5E7EB]`
- Card hover: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
- Section alternates: `bg-[#FFF9F4]` then `bg-[#EEF9F9]`
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section vertical padding: `py-16 md:py-24`
- Subtle paw-print watermarks in hero: SVG paw at 6% opacity, `#0A9396`, scattered decoratively

---

## COMPONENT LIBRARY — BUILD ALL OF THESE

### 1. `<Button />` — `/components/ui/Button.tsx`

Variants and exact Tailwind classes:

```tsx
// Primary
'bg-[#0A9396] text-white rounded-xl px-5 py-2.5 font-medium shadow-md
 hover:bg-[#005F73] hover:shadow-lg active:scale-95 transition-all duration-200'

// Secondary / Outline
'bg-transparent text-[#0A9396] border-2 border-[#0A9396] rounded-xl px-5 py-2.5
 font-medium hover:bg-[#EEF9F9] active:scale-95 transition-all duration-200'

// Accent (Sun)
'bg-[#EE9B00] text-white rounded-xl px-5 py-2.5 font-medium shadow-md
 hover:bg-[#d4880a] active:scale-95 transition-all duration-200'

// Danger
'bg-red-500 text-white rounded-xl px-5 py-2.5 font-medium
 hover:bg-red-600 active:scale-95 transition-all duration-200'

// Disabled (all variants)
'opacity-50 cursor-not-allowed pointer-events-none'

// Loading state (all variants)
// Show animate-spin SVG circle to left of label text
// Disable button during loading — prevent duplicate submissions
```

Props: `variant`, `size`, `isLoading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth`, `type`

### 2. `<Badge />` — `/components/ui/Badge.tsx`

```tsx
// Clinic
'bg-[#EEF9F9] text-[#005F73] text-xs font-medium px-3 py-1 rounded-full'

// NGO
'bg-[#EE9B00]/20 text-[#92610a] text-xs font-medium px-3 py-1 rounded-full'

// Service Provider
'bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full'

// Status: Pending
'bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full'

// Status: Confirmed
'bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full'

// Status: Rejected
'bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full'
```

### 3. `<Input />` — `/components/ui/Input.tsx`
```tsx
'w-full border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[#0D2B2E]
 placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0A9396]
 focus:border-transparent transition-all'
// Error state: add 'border-red-500 focus:ring-red-400'
// Helper text below: text-xs text-red-500 mt-1
```

### 4. `<Skeleton />` — `/components/ui/Skeleton.tsx`
```tsx
// Used while data loads — replicate exact shape of the real component
'animate-pulse bg-[#EEF9F9] rounded-2xl'
// Card skeleton: h-72 w-full rounded-2xl
// Text skeleton: h-4 rounded-full (varying widths: w-3/4, w-1/2, w-full)
```

### 5. `<Toast />` — `/components/ui/Toast.tsx`
- Appears bottom-right, slide-in animation, auto-dismiss 4s
- Success: `bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800`
- Error: `bg-red-50 border-l-4 border-red-500 text-red-700`
- Warning/Conflict: `bg-amber-50 border-l-4 border-[#EE9B00] text-amber-800`

---

## NAVBAR — `/components/layout/Navbar.tsx`

```
Layout: fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm h-16
        flex items-center justify-between px-4 sm:px-8

Left:   PAWZZ logo (paw SVG + wordmark)

Center: Directory · Volunteer · Booking
        text-[#4B5563] hover:text-[#0A9396] transition-colors font-medium
        Active route: text-[#005F73] font-semibold border-b-2 border-[#EE9B00]

Right:  Unauthenticated → outline Button "Login with Google"
        Authenticated   → circular avatar w-10 h-10 rounded-full border-2 border-[#0A9396]
                          Fallback: initials on bg-[#EEF9F9] text-[#005F73]
                          Click → dropdown: Profile · Dashboard · Logout
```

Dropdown rules:
- `absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1`
- Close on outside click (useEffect + document click listener)
- Close on Escape key
- Animate: `opacity-0 scale-95 → opacity-100 scale-100` transition-all duration-150

Mobile:
- Hamburger icon replaces center links
- Slide-in drawer from right: `bg-[#005F73] text-white w-72 h-full`
- Links in drawer: large, full-width, tap-friendly `py-4 px-6`

---

## PAGE: Homepage — `/app/page.tsx`

### Hero Section
```
bg-[#EEF9F9] py-24 relative overflow-hidden
Decorative: 2–3 paw SVG icons positioned absolutely, opacity-[0.06], color #0A9396
Organic wave SVG at bottom edge, #0A9396 at 10% opacity

Left side (text):
  Eyebrow: small teal badge "🐾 Trusted Pet Care Network"
  h1: "Find Trusted Pet Care Near You" — text-5xl font-bold text-[#0D2B2E]
  p:  "Connecting clinics, NGOs, and volunteers for happier, healthier pets."
  CTA pair:
    Primary button: "Explore Directory"  → /directory
    Outline button: "Volunteer With Us"  → /volunteer

Right side:
  Circular image frame (rounded-full overflow-hidden w-80 h-80 border-4 border-[#0A9396])
  Happy pet photo or illustration
```

### Stats Strip
```
bg-white py-10 border-y border-[#E5E7EB]
3 stats inline: "500+ Clinics" · "120+ NGOs" · "2,000+ Volunteers"
Each: large number in text-3xl font-bold text-[#0A9396] + label in text-[#4B5563]
Separator: vertical divider between each
```

### How It Works
```
bg-[#FFF9F4] py-20
h2: "How PAWZZ Works"
3-step cards in grid-cols-1 md:grid-cols-3 gap-8
Each card: bg-white rounded-2xl p-8 text-center border border-[#E5E7EB]
  Step number circle: w-12 h-12 rounded-full bg-[#EEF9F9] text-[#0A9396] font-bold text-xl
  Icon (teal, 32px)
  Step title h3
  Description text-[#4B5563]
```

### Featured Listings Preview
```
bg-[#EEF9F9] py-20
h2: "Trusted Partners Near You"
Show 3 listing cards (see Directory card spec)
CTA: "View All Listings" — accent button → /directory
```

### Volunteer CTA Banner
```
bg-[#005F73] py-16 rounded-3xl mx-8 my-16
h2: "Make a Difference for Pets" — text-white
p: subtext in text-white/80
Button: "Apply as Volunteer" — bg-[#EE9B00] text-white (accent button)
Decorative paw SVG right side in white at 15% opacity
```

---

## PAGE: Directory — `/app/directory/page.tsx`

**Rendering:** SSR (getServerSideProps equivalent in App Router) — pre-render initial listings for SEO. Client-side hydration for filters.

### Hero / Search Bar
```
bg-[#EEF9F9] py-10
Search console: bg-white rounded-2xl shadow-lg p-4 max-w-5xl mx-auto border border-[#E5E7EB]
                flex flex-col md:flex-row gap-4

  Location input: text input with map-pin icon (left icon slot)
  Category select: <select> — All · Clinics · NGOs · Services
  Services tags: multi-select combobox with pill tags in [#EEF9F9] text-[#005F73]
  Search button: primary button "Search"
```

Filter state must be reflected in URL params: `?type=clinic&city=mumbai&services=vaccination`

### Listing Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### Listing Card
```
bg-white rounded-2xl shadow-sm border border-[#E5E7EB]
hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col

Image area:   h-48 w-full object-cover bg-[#EEF9F9] rounded-t-2xl
              If no image: placeholder paw icon centered in teal tint bg

Card body (p-5 flex-grow):
  Badge:      <Badge variant="clinic" /> or <Badge variant="ngo" />
  Name:       text-lg font-bold text-[#0D2B2E] mt-2
  Location:   text-sm text-[#4B5563] flex items-center gap-1 (map-pin icon + city)
  Services:   flex-wrap gap-1, small pill tags in bg-[#EEF9F9] text-[#005F73] text-xs

Card footer (p-4 border-t border-[#E5E7EB] bg-[#FAFAFA] flex justify-between items-center):
  Left:  rating or tag
  Right: "Book Now" — accent button (bg-[#EE9B00])
```

### Data Masking (Public Users)
```tsx
// If !isAuthenticated:
// Replace phone, email, full address with:
<div className="relative">
  <div className="blur-sm select-none text-[#4B5563]">+91 99999 99999</div>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="bg-[#EEF9F9] text-[#005F73] text-xs px-3 py-1 rounded-lg border border-[#0A9396]/30">
      Login to view
    </span>
  </div>
</div>

// "Book Now" button click → open AuthModal if !isAuthenticated
```

### Loading State
- Show 6 `<Skeleton />` cards in same grid while fetching
- Each skeleton: same h-72 shape as real card

### Empty State
```
Centered, py-20
Illustration: sad paw SVG (simple, teal tinted)
h3: "No listings found"
p: "Try adjusting your filters or search in a different area"
Button: "Clear Filters" — outline variant
```

---

## PAGE: Booking — `/app/booking/page.tsx`

### Calendar
```
bg-white rounded-2xl border border-[#E5E7EB] p-4
Month nav: < prev | April 2026 | next >
Grid: 7 cols (Sun–Sat)

Day states:
  Default:   rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#EEF9F9] cursor-pointer text-[#0D2B2E]
  Today:     border-2 border-[#EE9B00] rounded-full text-[#0D2B2E]
  Selected:  bg-[#0A9396] text-white rounded-full font-semibold
  Past:      text-[#9CA3AF] cursor-not-allowed pointer-events-none
  Has slots: small teal dot beneath the date number
```

### Time Slot Grid
```
grid grid-cols-3 gap-3

Slot states:
  Available: border border-[#0A9396] text-[#005F73] rounded-xl py-2 text-sm
             hover:bg-[#EEF9F9] cursor-pointer transition-all
  Selected:  bg-[#0A9396] text-white rounded-xl py-2 text-sm font-semibold shadow-md
  Booked:    bg-[#F3F4F6] text-[#9CA3AF] rounded-xl py-2 text-sm
             line-through cursor-not-allowed
```

### Conflict State
```
// When 409 is returned from POST /book:
// Shake animation on slot grid + toast:
<Toast variant="warning">
  That slot was just taken! Please choose another time.
</Toast>
// Automatically refresh slot availability
```

### Confirmation Step
```
bg-white rounded-2xl p-6 border border-[#E5E7EB]
Provider name, date, time displayed clearly
"Confirm & Pay" → accent button → triggers Razorpay modal
"Change Slot" → secondary button → go back
```

---

## PAGE: Volunteer — `/app/volunteer/page.tsx`

### Form (React Hook Form + Zod)
```
Fields: Full Name · Email · Area of Interest (textarea)
Each field: <Input /> component + error message below in text-xs text-red-500
```

### Voice Recorder
```tsx
// Idle state:
<button className="w-16 h-16 rounded-full bg-[#EEF9F9] border-2 border-[#0A9396]
  text-[#0A9396] flex items-center justify-center hover:bg-[#d4f1ef] transition-colors">
  <MicIcon size={28} />
</button>
<p className="text-sm text-[#4B5563] mt-2">Click to start recording</p>

// Recording state:
<button className="w-16 h-16 rounded-full bg-red-500 text-white animate-pulse
  flex items-center justify-center">
  <StopIcon size={28} />
</button>
<p className="text-2xl font-mono text-[#0D2B2E] mt-2">00:47</p>

// Review state (after stop):
<audio controls className="w-full rounded-xl border border-[#E5E7EB] mt-4" />
<div className="flex gap-3 mt-4">
  <Button variant="primary">Submit Application</Button>
  <Button variant="outline">Retake Recording</Button>
</div>
```

MediaRecorder implementation:
- Use `MediaRecorder` Web API with `audio/webm` MIME type
- Collect chunks on `ondataavailable`
- Build Blob on `onstop`
- Create object URL for `<audio>` preview
- On submit: send Blob as FormData `audio` field

### Post-submit State
```
bg-[#EEF9F9] rounded-2xl p-8 text-center border border-[#0A9396]/20
Large paw icon in teal
h3: "Application Submitted!"
p:  "Your recording is being reviewed. We'll notify you via email."
Badge: <Badge variant="pending">Pending Review</Badge>
```

---

## PAGE: Admin — `/app/admin/page.tsx`

**Route guard:** If `user.role !== 'Admin'` → redirect to `/` immediately

### Layout
```
flex h-screen overflow-hidden

Sidebar: w-64 bg-[#0D2B2E] text-white flex-shrink-0 p-4
  Logo at top
  Nav links:
    Default:  text-[#9CA3AF] hover:text-white hover:bg-[#005F73]/30 rounded-lg px-3 py-2.5
    Active:   bg-[#0A9396]/20 text-white border-l-2 border-[#EE9B00] rounded-lg px-3 py-2.5
  Links: Dashboard · Listing Queue · Volunteer Queue · Settings

Main: flex-grow bg-[#FFF9F4] overflow-y-auto p-8
```

### Table Style
```
bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden

thead: bg-[#EEF9F9]
  th: text-xs font-semibold text-[#005F73] uppercase tracking-wide py-3 px-4

tbody tr:
  Default:  border-b border-[#E5E7EB] hover:bg-[#FAFAFA]
  td: text-sm text-[#4B5563] py-4 px-4
```

### Volunteer Review Modal
```
Overlay: bg-black/40 backdrop-blur-sm fixed inset-0 z-50
Modal: bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-auto

Top: <audio controls> — src = GridFS stream endpoint
Below: read-only textarea
  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4
             text-[#4B5563] italic leading-relaxed resize-none"
  value={submission.transcript || 'Transcription processing...'}

Actions:
  "Accept" → bg-emerald-500 text-white rounded-xl px-6 py-2.5 hover:bg-emerald-600
  "Reject" → bg-red-500 text-white rounded-xl px-6 py-2.5 hover:bg-red-600
  Both: require confirmation dialog before firing PATCH request
```

---

## AUTH MODAL — `/components/modals/AuthModal.tsx`

```
Overlay: fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center

Modal card: bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto

Content:
  PAWZZ paw logo + wordmark (centered, large)
  h2: "Welcome to PAWZZ" — text-2xl font-bold text-[#0D2B2E]
  p: "Join our pet care community"

  Google button:
    className="flex items-center justify-center gap-3 border border-[#E5E7EB]
               rounded-xl py-3 px-4 w-full hover:bg-[#EEF9F9] transition-colors
               text-[#0D2B2E] font-medium"
    Left: official Google G SVG logo (exact colors, not icon font)
    Text: "Continue with Google"

  Role selector (shown after Google auth, before first access):
    Radio group — each option as a card
    Selected: border-2 border-[#0A9396] bg-[#EEF9F9]
    Unselected: border border-[#E5E7EB]
    Roles: Vet Clinic · NGO · Service Provider · Volunteer / City Lead

Close: X button top-right, close on overlay click, close on Escape
```

---

## UI STATES — IMPLEMENT ALL OF THESE

| State | Component | Treatment |
|---|---|---|
| Loading | Any list/page | `<Skeleton />` cards in same layout |
| Empty | Directory, tables | Centered illustration + message + action |
| Error | Any fetch | Red toast + retry button |
| Conflict | Booking slot | Shake animation + warning toast + auto-refresh |
| Unauthorized | Protected routes | AuthModal opens, never raw 403 |
| Pending moderation | Volunteer status | Amber badge "Pending Review" |
| Payment pending | Booking | Blue info banner |
| Transcription processing | Admin review | Italic "Processing..." in transcript area |
| Form error | All forms | Red text below each invalid field — never alert() |
| Success | Form submit | Green toast + UI state change |

---

## ANIMATIONS & MICRO-INTERACTIONS

```css
/* Card lift */
.card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

/* Button press */
.btn:active { transform: scale(0.97); }

/* Modal open */
@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* Booking conflict shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(4px); }
}
```

All transitions: `transition-all duration-200 ease-out` as default
Skeleton pulse: `animate-pulse` with `bg-[#EEF9F9]`

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Behavior |
|---|---|
| `sm` (640px) | Stack most flex rows |
| `md` (768px) | 2-col grid for cards, show desktop nav |
| `lg` (1024px) | 3-col grid for directory |
| `xl` (1280px) | Max content width reached |

Mobile-first always. Never use desktop-first Tailwind overrides.

---

## FILE STRUCTURE

```
frontend/
├── app/
│   ├── layout.tsx             # Font + Navbar + AuthContext provider
│   ├── page.tsx               # Homepage
│   ├── directory/page.tsx     # SSR directory
│   ├── booking/page.tsx       # Booking flow
│   ├── volunteer/page.tsx     # Volunteer form + recorder
│   └── admin/page.tsx         # Admin dashboard (role-guarded)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── BookingForm.tsx
│   │   └── VolunteerForm.tsx
│   └── modals/
│       ├── AuthModal.tsx
│       ├── BookingModal.tsx
│       └── VolunteerReviewModal.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useBooking.ts
│   └── useMediaRecorder.ts
├── lib/
│   └── api.ts                 # Axios instance, base URL, cookie credentials
├── services/
│   ├── authService.ts
│   ├── directoryService.ts
│   └── bookingService.ts
└── types/
    └── index.ts               # User, Listing, Booking, Slot interfaces
```

---

## OUTPUT FORMAT

Generate in this order:
1. `tailwind.config.ts` — with brand colors and font
2. `app/layout.tsx` — font, AuthProvider, Navbar
3. `components/ui/Button.tsx` — all variants
4. `components/ui/Badge.tsx` — all variants
5. `components/ui/Input.tsx` — with error state
6. `components/ui/Skeleton.tsx`
7. `components/ui/Toast.tsx`
8. `context/AuthContext.tsx`
9. `components/layout/Navbar.tsx` — desktop + mobile
10. `components/modals/AuthModal.tsx`
11. `app/page.tsx` — Homepage (all sections)
12. `app/directory/page.tsx` — SSR + filters + cards + masking
13. `app/booking/page.tsx` — calendar + slots + conflict
14. `app/volunteer/page.tsx` — form + recorder + states
15. `app/admin/page.tsx` — sidebar + tables + review modal
16. `lib/api.ts`
17. `types/index.ts`

Do not skip any component. Do not use inline styles where Tailwind classes exist. Do not use any color values outside the defined palette. Every component must handle its own loading, error, and empty states.
