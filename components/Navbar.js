import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Navbar({ isLoggedIn, handleLogout }) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 flex flex-col md:flex-row justify-between items-center bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl mb-6"
    >
      <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">QR Maker</Link>
      {isLoggedIn ? (
        <Button onClick={handleLogout} variant="outline" className="mt-4 md:mt-0 bg-white/10 text-white hover:bg-white/20 border-white/20">
          Logout
        </Button>
      ) : (
        <div className="flex gap-4 mt-4 md:mt-0">
           <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
           <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign Up</Link>
        </div>
      )}
    </motion.div>
  );
}
