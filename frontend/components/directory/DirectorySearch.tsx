"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DirectorySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [sortby, setSortby] = useState(searchParams.get('sortby') || '');

  // Real-time Search: Auto-trigger when search, type or sort change
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms delay to prevent too many requests

    return () => clearTimeout(delayDebounceFn);
  }, [search, type, sortby]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (sortby) params.set('sortby', sortby);
    
    // Using { scroll: false } to keep the scroll position
    router.push(`/directory?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-cloud p-4 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto border border-teal-50 mt-8 relative z-20">
      <div className="flex-1 relative flex items-center border-b md:border-b-0 md:border-r border-gray-100">
        <span className="pl-6 text-xl">📍</span>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by city or area..." 
          className="w-full pl-4 pr-4 py-4 bg-transparent text-gray-700 font-bold outline-none placeholder:text-gray-300"
        />
      </div>
      <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-gray-100 relative">
        <select 
          value={type} 
          onChange={(e) => {
            setType(e.target.value);
            // Auto search when dropdown changes
          }}
          className="w-full h-full px-6 py-4 bg-transparent text-gray-700 font-bold outline-none appearance-none cursor-pointer"
        >
          <option value="">All Care</option>
          <option value="clinic">Vet Clinic</option>
          <option value="ngo">NGO Shelter</option>
        </select>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
      </div>
      <div className="w-full md:w-56 relative">
        <select 
          value={sortby}
          onChange={(e) => setSortby(e.target.value)}
          className="w-full h-full px-6 py-4 bg-transparent text-gray-700 font-bold outline-none appearance-none cursor-pointer"
        >
          <option value="">Sort: Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
      </div>
      <button 
        onClick={handleSearch}
        className="bg-teal-700 text-white rounded-[1.5rem] px-10 py-4 font-black shadow-sm hover:bg-teal-800 transition-all active:scale-95 whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
}
