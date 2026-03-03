import { useState, useEffect } from 'react';
import '../styles/globals.css'
import { Toaster } from '@/components/ui/sonner';
import { PageLoader } from '@/components/ui/Loader';

function MyApp({ Component, pageProps }) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initial app setup
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isInitializing && <PageLoader />}
      <div className={isInitializing ? 'hidden' : 'block'}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </>
  );
}

export default MyApp
