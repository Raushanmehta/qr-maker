import { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiEye, FiDownload, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';

export function ActionMenu({ qr, onToggleStatus, onView, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
      >
        <FiMoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-[#262626] border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          <div className="py-1">
             <button
              onClick={() => { onToggleStatus(qr._id, qr.isActive !== false); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {qr.isActive !== false ? <FiXCircle className="w-4 h-4 mr-2" /> : <FiCheckCircle className="w-4 h-4 mr-2" />}
              {qr.isActive !== false ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => { onView(qr); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <FiEye className="w-4 h-4 mr-2" />
              View Details
            </button>
            <a
              href={qr.qrImage}
              download={`qr-${qr.label || 'code'}.png`}
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Download
            </a>
            <div className="h-px w-full bg-white/10 my-1"></div>
            <button
              onClick={() => { onDelete(qr._id); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
