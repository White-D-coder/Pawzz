import { Metadata } from 'next';
import DirectoryContainer from '@/components/directory/DirectoryContainer';
import DirectorySearch from '@/components/directory/DirectorySearch';

export const metadata: Metadata = {
  title: 'Veterinary Directory | PAWZZ',
  description: 'Search for trusted veterinary clinics, NGOs, and pet care services in your area.',
  openGraph: {
    title: 'Veterinary Directory | PAWZZ',
    description: 'Search for trusted veterinary clinics, NGOs, and pet care services in your area.',
  }
};

// SSR Fetch function
async function getListings(searchParams: any) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const query = new URLSearchParams(searchParams).toString();
    const res = await fetch(`${apiUrl}/api/listings?${query}`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.listings || [];
  } catch (error) {
    console.error("❌ Directory Fetch Error:", error);
    return [];
  }
}

export default async function DirectoryPage({ searchParams }: { searchParams: any }) {
  const listings = await getListings(searchParams);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero & Search Console - Re-designed for 'Compassion First' */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-20 px-4 border-b border-teal-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full mb-6 tracking-widest uppercase shadow-sm">
            Trusted Partners
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-teal-950 tracking-tighter mb-6 leading-tight">
            Find <span className="text-amber-500">Professional</span> Care
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Discover veterinary clinics, NGOs, and service providers vetted for compassion and excellence.</p>
        </div>
        
        <DirectorySearch />
      </section>

      {/* Listing Grid Hand-off to Client Container */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full flex-grow">
        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-50">
            <div className="text-8xl mb-8 animate-bounce delay-75">🔍</div>
            <h3 className="text-2xl font-black text-teal-950">We couldn't find any care here yet</h3>
            <p className="text-gray-500 mt-4 font-medium max-w-sm mx-auto">Try adjusting your search criteria or explore a nearby city.</p>
          </div>
        ) : (
          <DirectoryContainer initialListings={listings} />
        )}
      </section>
    </div>
  );
}
