"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import axios from 'axios';

const volunteerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  areaOfInterest: z.string().min(1, "Please select an area of interest")
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

export default function VolunteerPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema)
  });
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'review'>('idle');
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingState('review');
        clearInterval(timerIntervalRef.current!);
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setTimer(0);
      
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied. We need your voice to hear your heart!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  const retakeRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState('idle');
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location access denied:", error);
        }
      );
    }
  }, []);

  const onSubmit = async (data: VolunteerForm) => {
    if (!audioBlob) {
      alert("Please record your statement before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('areaOfInterest', data.areaOfInterest);
    if (coords) {
      formData.append('longitude', coords.lng.toString());
      formData.append('latitude', coords.lat.toString());
    }
    formData.append('audio', audioBlob, `recording-${Date.now()}.webm`);

    console.log('🚀 Submitting volunteer form...', data);
    console.log('📍 Coords:', coords);
    
    try {
      console.log('📤 Sending POST request to backend...');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/volunteers/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      console.log('✅ Response:', response.data);
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error('❌ Submission Error:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-soft-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-cloud p-12 max-w-lg text-center border-4 border-teal-50"
        >
          <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">❤️</div>
          <h2 className="text-4xl font-extrabold text-teal-900 mb-6 tracking-tighter">Your voice is heard!</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
            Thank you for joining our <span className="text-amber-600 font-bold">Circle of Hope</span>. Our team is already listening to your story, and we'll reach out very soon.
          </p>
          <Button size="lg" className="w-full h-16 rounded-2xl" onClick={() => window.location.href = '/'}>Back to Community</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-soft-background pb-32">
      {/* Hero Section */}
      <section className="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="/image/thumb.jpeg" 
          alt="Volunteers with pets" 
          fill 
          className="object-cover brightness-75 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/40 via-transparent to-soft-background" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-400 text-teal-950 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-xl"
          >
            🌟 Be a Hero for a Soul
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg mb-4">
            Join the <span className="text-amber-400">Circle of Hope</span>
          </h1>
          <p className="text-xl text-white/90 font-bold max-w-2xl mx-auto drop-shadow-md">
            They can't speak for themselves, but you can. Your journey of compassion starts with a single voice.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Why Volunteer? - Visual Side */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="bg-white rounded-[2.5rem] shadow-cloud p-10 border border-teal-50 h-full">
            <h3 className="text-2xl font-black text-teal-950 mb-8 border-b border-teal-50 pb-4">Why your voice matters?</h3>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">📍</div>
                <div>
                  <h4 className="font-bold text-teal-900 text-lg">City-Level Leadership</h4>
                  <p className="text-sm text-gray-500 font-medium">Coordinate rescues and make your neighborhood a safer place for stray animals.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">🤝</div>
                <div>
                  <h4 className="font-bold text-teal-900 text-lg">Direct Impact</h4>
                  <p className="text-sm text-gray-500 font-medium">Assist NGOs and clinics in high-priority rescue operations.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">🏡</div>
                <div>
                  <h4 className="font-bold text-teal-900 text-lg">Fostering Bonds</h4>
                  <p className="text-sm text-gray-500 font-medium">Provide temporary homes and love to pets in transition.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-teal-950 rounded-[2rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 group-hover:scale-110 transition-transform">🐾</div>
                <div className="relative z-10">
                  <p className="italic text-teal-100 mb-4">"Volunteering at PAWZZ changed my life as much as it changed the pets I helped. It's pure magic."</p>
                  <p className="font-black text-amber-400">— Sarah, City Lead</p>
                </div>
            </div>
          </div>
        </div>

        {/* The Application Form */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-cloud overflow-hidden border border-teal-50"
          >
            <div className="bg-teal-950 px-10 py-12 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-bl-full opacity-10" />
              <h2 className="text-3xl font-black mb-2 relative z-10">Your Application</h2>
              <p className="text-teal-200 font-medium relative z-10">Tell us about yourself and record your heart's mission.</p>
            </div>

            <div className="p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-950 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      {...register("fullName")}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-teal-700 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="Enter your name"
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] font-bold px-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-950 uppercase tracking-widest pl-1">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-teal-700 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="name@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold px-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-teal-950 uppercase tracking-widest pl-1">Area of Passion</label>
                  <div className="relative">
                    <select
                      {...register("areaOfInterest")}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-teal-700 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Where does your heart lie?</option>
                      <option value="Rescue Operations">Rescue & Missions</option>
                      <option value="Fostering">Fostering & Care</option>
                      <option value="City Lead">Community Leadership</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-teal-900 font-bold">⌄</div>
                  </div>
                  {errors.areaOfInterest && <p className="text-red-500 text-[10px] font-bold px-1">{errors.areaOfInterest.message}</p>}
                </div>

                {/* AUDIO RECORDER - REIMAGINED */}
                <div className="mt-12 p-1 pt-0">
                  <div className="bg-amber-50/50 rounded-[2rem] border-2 border-dashed border-amber-200 p-8 flex flex-col items-center text-center">
                    <h4 className="font-black text-teal-950 mb-2">Speak for the Voiceless</h4>
                    <p className="text-xs text-gray-500 font-medium mb-8 max-w-xs">Record a short statement about why you want to join our mission.</p>
                    
                    <AnimatePresence mode="wait">
                      {recordingState === 'idle' && (
                        <motion.button
                          key="idle"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          type="button"
                          onClick={startRecording}
                          className="w-20 h-20 rounded-full bg-white text-teal-700 flex justify-center items-center shadow-cloud hover:scale-105 transition-transform"
                        >
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      )}

                      {recordingState === 'recording' && (
                        <motion.div
                          key="recording"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex flex-col items-center"
                        >
                          <div className="relative">
                            <motion.div 
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute inset-0 bg-red-400 rounded-full opacity-20"
                            />
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="relative w-24 h-24 rounded-full bg-red-500 text-white flex justify-center items-center shadow-lg hover:scale-105 transition-transform"
                            >
                              <div className="w-8 h-8 bg-white rounded-lg shadow-inner" />
                            </button>
                          </div>
                          <span className="mt-6 text-3xl font-black text-red-500 font-mono tracking-tighter tabular-nums drop-shadow-sm">
                            {formatTimer(timer)}
                          </span>
                        </motion.div>
                      )}

                      {recordingState === 'review' && audioUrl && (
                        <motion.div
                          key="review"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="w-full flex flex-col items-center"
                        >
                          <audio controls src={audioUrl} className="w-full h-12 mb-8 accent-teal-700" />
                          <div className="flex gap-4 w-full">
                            <Button type="button" variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={retakeRecording}>
                              Start Fresh
                            </Button>
                            <Button type="submit" variant="primary" className="flex-1 h-14 rounded-2xl" isLoading={isSubmitting}>
                              Join the Tribe
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs text-center font-bold shadow-inner">
                    ❌ {submitError}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
