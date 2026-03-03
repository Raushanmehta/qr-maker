import Link from 'next/link';
import { motion } from 'framer-motion';

export function QRListSection({ generatedQRs, isLoggedIn }) {
  const latestQR = generatedQRs && generatedQRs.length > 0 ? generatedQRs[0] : null;

  return (
    <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="mt-4 lg:mt-0 w-full  self-start"
    >
      <div className="bg-[#1A1A1A] rounded-[16px] p-6 lg:p-8 min-h-[400px] flex flex-col items-center justify-start border border-white/10">
        <div className="flex justify-center items-center gap-3 font-medium mb-4">
            <h3 className="text-white text-[18px] font-bold">Download your QR</h3>
        </div>

        {!isLoggedIn ? (
          <p className="text-gray-400 text-center py-10 w-full mt-10">
            Please <Link href="/login" className="text-saas-orange hover:underline font-bold">login</Link> to view your generated QR codes.
          </p>
        ) : !latestQR ? (
          <div></div>
        ) : (
          <>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               key={latestQR._id}
               className=" rounded-2xl w-full max-w-[300px] aspect-square shadow-sm flex items-center justify-center p-4 mb-8"
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <img src={latestQR.qrImage} alt="QR Code" className="w-[85%] h-auto rounded-lg" />
                    {latestQR.logo && (
                    <img 
                        src={latestQR.logo} 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded bg-white p-1 object-cover"
                        alt="Logo"
                    />
                    )}
                </div>
            </motion.div>
            
            <a 
              href={latestQR.qrImage} 
              download={`qr-${latestQR.label}.png`}
              className="flex items-center justify-between w-full max-w-[250px] px-6 py-3 rounded-[30px] bg-saas-orange hover:bg-orange-600 text-white font-semibold text-[15px] transition-colors shadow-lg"
            >
              Download QR
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </>
        )}
      </div>
    </motion.div>
  );
}
