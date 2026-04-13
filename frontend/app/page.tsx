import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden relative">
      {/* Soft Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-amber-50/50 to-transparent -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 md:px-8 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start text-left">
          <div className="mb-6 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
            <span>🦴</span> Caring for your family
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-teal-900 leading-[1.05] mb-8 tracking-tight">
            Every <span className="text-amber-500">Paw</span> Deserves a <span className="text-teal-700 underline decoration-amber-200 underline-offset-8">Helping Hand</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed mb-10 font-medium">
            PAWZZ is a dedicated community connecting you with trusted vets, supportive NGOs, and passionate volunteers. Because they’re not just pets—they’re family.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-12 w-full">
            <Link href="/directory">
              <Button size="lg" className="text-lg px-10 h-16 w-full sm:w-auto">
                Find Care Now
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button variant="secondary" size="lg" className="text-lg px-10 h-16 w-full sm:w-auto">
                Be a Hero
              </Button>
            </Link>
          </div>

          {/* Search Console - Integrated */}
          <div className="w-full bg-white rounded-[2.5rem] shadow-cloud border border-amber-50 p-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-6 gap-3 border-b md:border-b-0 md:border-r border-gray-50 py-3">
              <span className="text-xl">📍</span>
              <input type="text" placeholder="Where are you?" className="w-full bg-transparent outline-none text-gray-700 font-semibold placeholder:text-gray-400" />
            </div>
            <div className="flex-1 flex items-center px-6 gap-3 py-3">
              <span className="text-xl">🐾</span>
              <input type="text" placeholder="What does your pet need?" className="w-full bg-transparent outline-none text-gray-700 font-semibold placeholder:text-gray-400" />
            </div>
            <Link href="/directory" className="flex">
              <Button className="rounded-[2rem] px-10 h-14 md:h-auto w-full">
                Search
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Area */}
        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center">
          {/* Main Blob Image Container */}
          <div
            className="absolute inset-0 overflow-hidden shadow-cloud bg-[#5CACEE] border-8 border-white"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
          >
            <Image
              src="/image/ami.jpeg"
              alt="Caring for pets"
              fill
              className="object-cover object-bottom"
              priority
            />
            <div className="absolute inset-0 bg-transparent mix-blend-overlay" />
          </div>

          {/* Play Button - Centered or Floating */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
             <button className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group border-4 border-white">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[#5CACEE] border-b-[10px] border-b-transparent ml-1" />
             </button>
          </div>
        </div>
      </section>

      {/* Feature Section: Compassionate Vets */}
      <section className="py-24 px-4 w-full bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative h-[500px] order-2 md:order-1">
            <div className="absolute inset-0 bg-teal-100/30 rounded-[3rem] -rotate-3 -z-10" />
            <div className="absolute inset-0 overflow-hidden rounded-[3rem] shadow-cloud bg-teal-50">
              <Image
                src="/image/1.jpeg"
                alt="Compassionate Vet"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-teal-950 mb-6 leading-tight">Expert Care with a <span className="text-amber-500">Gentle Touch</span></h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every vet in our directory is fully verified and committed to providing the same level of care they would for their own pets. Book instantly and find the comfort your pet needs.
            </p>
            <Link href="/directory?type=clinic">
              <Button className="h-16 px-10 text-lg">Explore Clinics</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section: Rescue Bond */}
      <section className="py-24 px-4 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-teal-950 mb-6 leading-tight">Join the <span className="text-teal-700 text-6xl block">Circle of Hope</span></h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Become a volunteer and make a real difference in a rescue animal's life. We need your heart, your time, and your voice.
            </p>
            <Link href="/volunteer">
              <Button variant="secondary" className="h-16 px-10 text-lg">Apply to Volunteer</Button>
            </Link>
          </div>
          <div className="relative h-[500px]">
            <div className="absolute inset-0 bg-amber-100/40 rounded-full scale-110 -z-10 blur-3xl" />
            <div className="absolute inset-0 overflow-hidden rounded-[30px] shadow-cloud border-[12px] border-white">
              <Image
                src="/image/Dog.jpeg"
                alt="Rescue Bond"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Paw Decoration */}
      <div className="fixed bottom-10 right-10 text-9xl opacity-[0.05] pointer-events-none select-none drop-shadow-sm">🐾</div>
    </main>
  );
}
