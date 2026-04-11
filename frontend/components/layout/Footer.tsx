import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-2xl font-extrabold flex items-center gap-2 mb-6">
            <span className="text-teal-500">🐾</span> PAWZZ
          </Link>
          <p className="text-white/70 text-sm leading-relaxed">
            Connecting veterinary clinics, NGOs, and volunteers to provide the best care for every pet. Together, we make a difference.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-amber-500">Platform</h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
            <li><Link href="/volunteer" className="hover:text-white transition-colors">Volunteer Portal</Link></li>
            <li><Link href="/booking" className="hover:text-white transition-colors">Booking Slots</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-amber-500">Community</h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li><Link href="/listing/new" className="hover:text-white transition-colors">Register Clinic</Link></li>
            <li><Link href="/ngos" className="hover:text-white transition-colors">NGO Partners</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Local Events</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-amber-500">Contact</h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-center gap-2"><span>📍</span> Indore, India</li>
            <li className="flex items-center gap-2"><span>📧</span> hello@pawzz.in</li>
            <li className="flex items-center gap-2"><span>📞</span> +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 uppercase tracking-widest font-bold">
        <p>© 2026 PAWZZ. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
