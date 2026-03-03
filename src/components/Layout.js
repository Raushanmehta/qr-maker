import React from 'react';
import Head from 'next/head';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children, isLoggedIn, handleLogout }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>QR Maker - Create Custom QR Codes</title>
        <meta name="description" content="Generate custom colored QR codes with logos instantly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Navbar sits on top with full width */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      {/* Content area is contrained and centered */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
