import React from 'react';
import Head from 'next/head';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ 
  children, 
  isLoggedIn, 
  handleLogout, 
  title = "FREE QR - Create Custom QR Codes",
  description = "Generate custom colored, highly scalable QR codes instantly. Create, track, and manage dynamic links in seconds.",
  keywords = "qr maker, free qr code generator, custom qr, dynamic qr, qr link manager"
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Social SEO */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        
        {/* Twitter SEO */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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
