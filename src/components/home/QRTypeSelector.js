import { motion } from 'framer-motion';
import { FiGlobe, FiFileText, FiImage, FiVideo } from 'react-icons/fi';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { BsPersonVcard } from 'react-icons/bs';

export function QRTypeSelector({ qrType, setQrType }) {
  const types = [
    { id: 'website', icon: <FiGlobe />, label: 'Website' },
    { id: 'text', icon: <FiFileText />, label: 'Text' },
    { id: 'pdf', icon: <AiOutlineFilePdf />, label: 'PDF' },
    { id: 'image', icon: <FiImage />, label: 'Images' },
    { id: 'vcard', icon: <BsPersonVcard />, label: 'vCard Plus' },
    { id: 'video', icon: <FiVideo />, label: 'Video' },
  ];

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#1C1C1E] rounded-xl shadow-lg border border-[#2C2C2E] p-2 mb-6 flex flex-col justify-center"
    >
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap w-full overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {types.map((type) => {
          const isSelected = qrType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setQrType(type.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all mr-1 whitespace-nowrap ${
                isSelected 
                  ? 'bg-saas-orange/10 text-saas-orange border border-saas-orange/30 shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={`text-lg ${isSelected ? 'text-saas-orange' : 'text-gray-500'}`}>
                {type.icon}
              </span>
              {type.label}
            </button>
          );
        })}
      </div>
      
    </motion.div>
  );
}
