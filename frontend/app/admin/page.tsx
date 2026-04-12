"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the most useful starting page
    router.replace('/admin/analytics');
  }, [router]);

  return <div className="p-20 text-center font-black text-teal-900 animate-pulse uppercase tracking-[0.5em]">Loading Administrator Dashboard...</div>;
}
