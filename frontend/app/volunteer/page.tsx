"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
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
      alert("Microphone access denied or unavailable.");
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

  const onSubmit = async (data: VolunteerForm) => {
    if (!audioBlob) {
      alert("Please record your audio statement.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('areaOfInterest', data.areaOfInterest);
    formData.append('audioData', audioBlob, `recording-${Date.now()}.webm`);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/volunteers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center animate-in zoom-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Application Submitted</h2>
          <p className="text-gray-600 mb-8">
            Your application is currently <strong>pending review</strong>. Our system is asynchronously processing your audio via the worker pipeline.
          </p>
          <Button onClick={() => window.location.href = '/'}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-teal-700 p-8 text-center text-white">
          <h1 className="text-3xl font-extrabold mb-2">Become a Volunteer</h1>
          <p className="text-teal-100">Help complete our mission entirely via audio.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 outline-none"
                placeholder="Jane Doe"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 outline-none"
                placeholder="jane@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Area of Interest</label>
              <select
                {...register("areaOfInterest", { required: "Area of interest is required" })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 outline-none bg-white"
              >
                <option value="">Select an area...</option>
                <option value="Fostering">Fostering</option>
                <option value="Rescue Operations">Rescue Operations</option>
                <option value="City Lead">City Lead</option>
              </select>
              {errors.areaOfInterest && <p className="text-red-500 text-xs mt-1">{errors.areaOfInterest.message}</p>}
            </div>

            <div className="pt-6 border-t border-gray-100 text-center">
              <h3 className="font-bold text-gray-900 mb-4">Record your Audio Statement</h3>
              
              {recordingState === 'idle' && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex justify-center items-center hover:bg-teal-200 transition-colors shadow-sm"
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              )}

              {recordingState === 'recording' && (
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-red-500 text-white flex justify-center items-center animate-pulse shadow-md"
                  >
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </button>
                  <p className="text-2xl font-mono text-gray-800 mt-4">{formatTimer(timer)}</p>
                </div>
              )}

              {recordingState === 'review' && audioUrl && (
                <div className="flex flex-col items-center w-full">
                  <audio controls src={audioUrl} className="w-full mb-6" />
                  <div className="flex gap-4 w-full">
                    <Button type="button" variant="secondary" className="flex-1" onClick={retakeRecording}>
                      Retake
                    </Button>
                    <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                      Submit Application
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
                {submitError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
