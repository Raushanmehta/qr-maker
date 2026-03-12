import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { AccountLayout } from '@/components/account/AccountLayout';
import { StatsGrid } from '@/components/account/StatsGrid';
import { QRTable } from '@/components/account/QRTable';
import { QRDetailsModal } from '@/components/account/QRDetailsModal';

export default function AccountDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
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
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setGeneratedQRs([]); 
    router.push('/login');
    toast.info('Logged out successfully');
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/generate', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedQRs(generatedQRs.map(qr => qr._id === id ? { ...qr, isActive: !currentStatus } : qr));
        toast.success(`QR Code marked as ${!currentStatus ? 'Active' : 'Inactive'}`);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
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
        toast.success('QR Code deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete QR code');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting');
    }
  };

  return (
    <AccountLayout title="Dashboard - FREE QR Analytics">
      <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto w-full space-y-8 min-h-[500px]"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Account Dashboard</h1>
          <p className="text-gray-400">Overview of your QR Codes, scans, and active status.</p>
        </div>

        <StatsGrid generatedQRs={generatedQRs} loading={loading} />

        <QRTable 
          loading={loading} 
          generatedQRs={generatedQRs} 
          onToggleStatus={toggleStatus} 
          onView={setSelectedQR} 
          onDelete={handleDelete}
        />

        <QRDetailsModal 
          selectedQR={selectedQR} 
          onClose={() => setSelectedQR(null)} 
        />
        
      </motion.div>
    </AccountLayout>
  );
}
