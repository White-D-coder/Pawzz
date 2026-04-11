import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-brand-bg overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-[600px] opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="#0A9396" fillOpacity="1" d="M0,128L48,122.7C96,117,192,107,288,122.7C384,139,480,181,576,181.3C672,181,768,139,864,133.3C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
          <span>🐾</span> Connecting Pet Care, Together.
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-sky max-w-4xl tracking-tight leading-[1.1] mb-6">
          Find Trusted <span className="text-brand-primary">Pet Care</span> Near You
        </h1>
        
        <p className="text-lg md:text-xl text-text-body max-w-2xl leading-relaxed mb-10">
          The unified platform connecting veterinary clinics, NGOs, and volunteers to provide the best care for every pet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button size="lg" className="text-lg">
            Explore Directory
          </Button>
          <Button variant="secondary" size="lg" className="text-lg bg-white/50 backdrop-blur-sm">
            Volunteer With Us
          </Button>
        </div>

        {/* Search Console Placeholder */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-soft border border-surface-border p-3 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-2">
            <span className="text-lg opacity-40">📍</span>
            <input type="text" placeholder="Location" className="w-full bg-transparent outline-none text-text-body font-medium" />
          </div>
          <div className="flex-1 flex items-center px-4 gap-3 py-2">
            <span className="text-lg opacity-40">🔍</span>
            <input type="text" placeholder="Clinic, NGO, or Service..." className="w-full bg-transparent outline-none text-text-body font-medium" />
          </div>
          <Button variant="accent" className="rounded-xl px-8">
            Search
          </Button>
        </div>
      </section>

      {/* Paw watermarks */}
      <div className="fixed bottom-10 right-10 text-9xl opacity-[0.03] pointer-events-none select-none">🐾</div>
      <div className="fixed top-40 left-10 text-8xl opacity-[0.02] pointer-events-none select-none -rotate-12">🐾</div>
    </main>
  );
}
