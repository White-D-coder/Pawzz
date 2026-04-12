import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <Navbar />
            <div className="pt-16 min-h-screen">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
