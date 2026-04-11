import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { GoogleOAuthProvider } from '@react-oauth/google';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "PAWZZ | Connecting Pet Care, Together.",
  description: "The unified platform for clinics, NGOs, and volunteers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans bg-brand-bg antialiased`}>
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

