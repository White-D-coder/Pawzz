# 🎨 PAWZZ | UI/UX Design System Specification

## 1. GLOBAL UI/UX DESIGN SYSTEM & TAILWIND SPECIFICATIONS
The application must feel trustworthy, modern, and accessible. Use Tailwind CSS strictly. Consistent design language, spacing rhythm, color usage, and component behavior.

* Use soft surfaces, subtle shadows, clean borders, and accessible contrast.
* Prefer whitespace over clutter.
* Consistent card treatment across listings, forms, and dashboards.
* Strong hierarchy in typography.
* Legible forms.
* Responsive design (mobile, tablet, laptop, desktop).
* Avoid visually noisy elements.

### A. Color Palette & Typography
* **Primary Brand (Teal)**: `#0F766E` (Tailwind teal-700). Primary actions, active states.
* **Secondary Brand (Amber)**: `#F59E0B` (Tailwind amber-500). Warnings, secondary badges.
* **Backgrounds**: Global background `#F9FAFB` (gray-50). Surface backgrounds `#FFFFFF` (white).
* **Text Colors**: Headings `#111827` (gray-900), Body `#4B5563` (gray-600), Placeholder `#9CA3AF` (gray-400).
* **Semantic Colors**: Success `#10B981` (emerald-500), Error `#EF4444` (red-500), Info `#3B82F6` (blue-500).
* **Typography**: `next/font/google` using **Inter**. Headings font-bold tracking-tight; body font-normal leading-relaxed.

### B. Standardized Button Components
* **Primary**: `bg-teal-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 hover:bg-teal-800 hover:shadow-lg active:scale-95`.
* **Secondary/Outline**: `bg-transparent text-teal-700 border-2 border-teal-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:bg-teal-50 active:scale-95`.
* **Danger**: `bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 shadow-sm active:scale-95`.
* **Disabled**: `opacity-50 cursor-not-allowed pointer-events-none`.
* **Loading**: Render a spinning SVG circle (animate-spin) inside the button.

### C. Global Layouts & Navigation
* **Navbar**: Fixed top, `bg-white shadow-sm z-50 h-16`.
* **Left**: Pawzz Logo (Teal text, bold, text-xl).
* **Center (Desktop)**: Links with `hover:text-teal-700`.
* **Right**: Unauthenticated: "Login with Google" outline button. Authenticated: Circular User Avatar (w-10 h-10). Dropdown menu with Profile, Dashboard, Logout.
* **Mobile**: Navigation collapses cleanly into a menu drawer or dropdown.

## 11. FRONTEND IMPLEMENTATION RULES
* Use Next.js App Router.
* Server components where beneficial; client components for interactivity.
* Consistent loading/error states.
* Reusable form inputs and modals.
* Accessible semantic HTML.
* Centralized auth state.
* Sync relevant state with URL.
* Responsive sections.
* Immediate visual feedback for actions.
