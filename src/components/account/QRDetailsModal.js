import { motion } from 'framer-motion';
import { FiXCircle, FiDownload, FiLink } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export function QRDetailsModal({ selectedQR, onClose }) {
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    if (selectedQR && selectedQR.shortCode) {
      const host = window.location.host;
      const protocol = window.location.protocol;
      setTrackingUrl(`${protocol}//${host}/q/${selectedQR.shortCode}`);
    }
  }, [selectedQR]);

  if (!selectedQR) return null;
  
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <FiXCircle className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-4 pr-8">{selectedQR.label || "QR Code"}</h2>
          
          <div className="bg-white p-4 rounded-xl flex justify-center mb-6 max-w-xs mx-auto">
            <img src={selectedQR.qrImage} alt="QR Code" className="w-full h-auto object-contain" />
          </div>
          
          <div className="space-y-4 text-sm">
            {selectedQR.isDynamic && trackingUrl && (
              <div>
                <span className="text-saas-orange text-xs font-bold uppercase tracking-wider block mb-1">Dynamic Tracking URL</span>
                <div className="bg-saas-orange/10 border border-saas-orange/20 p-2 rounded-lg text-saas-orange break-all font-mono text-[10px] flex items-center gap-2">
                  <FiLink className="flex-shrink-0" />
                  {trackingUrl}
                </div>
              </div>
            )}

            <div>
              <span className="text-gray-400 block mb-1">Target / Content</span>
              <div className="bg-white/5 p-3 rounded-lg text-white break-all font-mono text-xs">
                {selectedQR.content}
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Total Scans</span>
              <span className="font-bold text-saas-orange text-lg">{selectedQR.scanCount || 0}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Status</span>
              <span className={selectedQR.isActive !== false ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                {selectedQR.isActive !== false ? "● Active" : "○ Inactive"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Created</span>
              <span className="text-white">{new Date(selectedQR.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a 
              href={selectedQR.qrImage} 
              download={`qr-${selectedQR.label || 'code'}.png`}
              className="flex-1 bg-saas-orange text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#E46A29] transition-colors shadow-lg shadow-orange-500/20"
            >
              <FiDownload className="w-4 h-4" /> Download
            </a>
          </div>
        </motion.div>
      </div>
  );
}
