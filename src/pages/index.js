import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

import { Layout } from '@/components/Layout';
import { QRTypeSelector } from '@/components/home/QRTypeSelector';
import { QRFormSection } from '@/components/home/QRFormSection';
import { QRListSection } from '@/components/home/QRListSection';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [qrType, setQrType] = useState('website');
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchQRs(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchQRs = async (token) => {
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
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch QR codes');
    }
  };

  const handleNewQR = (newQR) => {
    setGeneratedQRs([newQR, ...generatedQRs]);
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
      <QRTypeSelector qrType={qrType} setQrType={setQrType} />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] 
      gap-8 bg-saas-black">
        <QRFormSection qrType={qrType} onNewQR={handleNewQR} />
        <QRListSection 
          generatedQRs={generatedQRs} 
          isLoggedIn={isLoggedIn} 
          handleDelete={handleDelete} 
        />
      </div>
    </Layout>
  );
}
