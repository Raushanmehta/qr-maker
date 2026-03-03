import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full animate-fade-in">
      <p className="text-gray-400 font-medium animate-pulse text-lg tracking-widest uppercase">Loading...</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-saas-black flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <div className="flex flex-col items-center gap-4">
            <div className="text-4xl font-extrabold text-white flex items-center gap-2">
                <span className="text-saas-orange italic">FREE</span>QR
            </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-1 bg-saas-orange rounded-full overflow-hidden"
      >
         <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-white/30"
         />
      </motion.div>
    </div>
  );
}
