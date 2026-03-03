import '../styles/globals.css'
import { Toaster } from '@/components/ui/sonner';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

export default MyApp
