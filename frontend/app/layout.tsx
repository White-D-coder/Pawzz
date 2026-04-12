import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

import { GoogleOAuthProvider } from '@react-oauth/google';

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "PAWZZ | Connecting Pet Care, Together.",
  description: "The unified platform for clinics, NGOs, and volunteers.",
  openGraph: {
    title: 'PAWZZ | Connecting Pet Care',
    description: 'The unified platform connecting veterinary clinics, NGOs, and volunteers to provide the best care for every pet.',
    url: 'https://pawzz.in',
    siteName: 'PAWZZ',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAWZZ | Connecting Pet Care',
    description: 'The unified platform connecting veterinary clinics, NGOs, and volunteers.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans`}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <Navbar />
            <div className="pt-16 min-h-screen">
              {children}
            </div>
            <Footer />
            <ChatWidget />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
