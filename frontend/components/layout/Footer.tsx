import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-teal-950 text-white pt-24 pb-12 px-6 md:px-10 rounded-t-[3rem] mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-3xl font-black flex items-center gap-2 mb-8 tracking-tighter">
            <span className="text-amber-500">🐾</span> PAWZZ
          </Link>
          <p className="text-gray-300 text-base leading-relaxed font-medium">
            Building a community where every pet is family and every person is a hero. Connecting care, compassion, and community together.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-xl mb-8 text-amber-500">Explore</h4>
          <ul className="space-y-5 text-gray-300 font-bold">
            <li><Link href="/directory" className="hover:text-amber-400 transition-colors">Directory</Link></li>
            <li><Link href="/volunteer" className="hover:text-amber-400 transition-colors">Volunteer Portal</Link></li>
            <li><Link href="/booking" className="hover:text-amber-400 transition-colors">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xl mb-8 text-amber-500">Join Us</h4>
          <ul className="space-y-5 text-gray-300 font-bold">
            <li><Link href="/listing/new" className="hover:text-amber-400 transition-colors">Register Clinic</Link></li>
            <li><Link href="/ngos" className="hover:text-amber-400 transition-colors">NGO Partners</Link></li>
            <li><Link href="/events" className="hover:text-amber-400 transition-colors">Support Nearby</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xl mb-8 text-amber-500">Connect</h4>
          <ul className="space-y-5 text-gray-300 font-bold">
            <li className="flex items-center gap-3"><span className="text-xl">📍</span> Indore, MP, Bharat</li>
            <li className="flex items-center gap-3"><span className="text-xl">📧</span> hello@pawzz.in</li>
            <li className="flex items-center gap-3 text-amber-500 underline underline-offset-4 cursor-pointer hover:text-amber-400">@pawzz_social</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400 font-bold">
        <p>© 2026 PAWZZ. Pure Love, Pure Care.</p>
        <div className="flex gap-10">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
