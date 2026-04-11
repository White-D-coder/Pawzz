export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-brand-bg">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-brand-dark">
          PAWZZ
        </h1>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xl text-brand-primary">
          Connecting Pet Care, Together.
        </p>
      </div>

      <div className="mt-12 flex gap-4">
        <button className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-brand-dark transition-all active:scale-95">
          Explore Directory
        </button>
        <button className="border-2 border-brand-primary text-brand-primary px-6 py-3 rounded-xl font-medium hover:bg-brand-bg transition-all active:scale-95">
          Volunteer With Us
        </button>
      </div>
    </main>
  );
}
