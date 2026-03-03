import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';

export default function History() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchQRs(token);
    } else {
      setIsLoggedIn(false);
      router.push('/login');
    }
  }, []);

  const fetchQRs = async (token) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedQRs(data.data);
      } else if (data.message === 'Invalid token' || data.message === 'Not authenticated') {
         localStorage.removeItem('token');
         setIsLoggedIn(false);
         router.push('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/generate', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedQRs(generatedQRs.filter(qr => qr._id !== id));
        toast.success('QR Code deleted');
      } else {
        toast.error(data.message || 'Failed to delete QR code');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setGeneratedQRs([]); 
    router.push('/login');
    toast.info('Logged out successfully');
  };

  return (
    <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
      <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#1A1A1A] border-white/10 shadow-lg min-h-[500px]">
          <CardHeader>
              <CardTitle className="text-2xl text-white font-bold">QR Code History</CardTitle>
          </CardHeader>
          <CardContent>
              {loading ? (
                <Loader />
              ) : generatedQRs.length === 0 ? (
              <p className="text-gray-400 text-center py-20">No QR codes generated yet.</p>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {generatedQRs.map((qr, index) => (
                  <motion.div 
                      key={qr._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#262626] rounded-[16px] p-4 flex flex-col items-center hover:bg-[#333333] transition-colors border border-transparent hover:border-saas-orange shadow-sm hover:shadow"
                  >
                      <div className="relative inline-block mb-4 p-2 bg-white rounded-xl shadow-sm">
                          <img src={qr.qrImage} alt="QR Code" className="w-[120px] h-auto rounded" />
                          {qr.logo && (
                          <img 
                              src={qr.logo} 
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white p-0.5 object-cover"
                              alt="Logo"
                          />
                          )}
                      </div>
                      <p className="font-bold text-white mb-1 truncate w-full text-center">{qr.label || "QR Code"}</p>
                      <p className="text-xs text-gray-400 mb-4 truncate w-full text-center px-2">{qr.content}</p>
                      <div className="flex gap-2 w-full mt-auto">
                          <a href={qr.qrImage} download={`qr-${qr.label}.png`} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 px-3 rounded text-center transition-colors border border-white/10">
                            Download
                          </a>
                          <button 
                            onClick={() => handleDelete(qr._id)}
                            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2 px-3 rounded transition-colors border border-transparent"
                          >
                            Delete
                          </button>
                      </div>
                  </motion.div>
                  ))}
              </div>
              )}
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}
