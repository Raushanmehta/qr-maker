import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FiBarChart2 as BarChart3, FiGrid as BorderAll, FiActivity as Activity, FiClock as Clock } from 'react-icons/fi';

export function StatsGrid({ generatedQRs, loading }) {
  const totalGenerated = generatedQRs.length;
  const totalScans = generatedQRs.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);
  
  const now = new Date();
  const activeQRs = generatedQRs.filter(qr => qr.isActive !== false && (!qr.expiresAt || new Date(qr.expiresAt) > now)).length;
  const deactiveQRs = totalGenerated - activeQRs;

  const stats = [
    { label: "Total QR Generated", value: totalGenerated, icon: <BorderAll className="text-saas-orange w-6 h-6" /> },
    { label: "Total Scans", value: totalScans, icon: <BarChart3 className="text-blue-500 w-6 h-6" /> },
    { label: "Active QRs", value: activeQRs, icon: <Activity className="text-green-500 w-6 h-6" /> },
    { label: "Inactive/Expired", value: deactiveQRs, icon: <Clock className="text-red-500 w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 + 0.2 }}
        >
          <Card className="bg-[#1A1A1A] border-white/10 shadow-lg hover:border-saas-orange/50 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {loading ? <span className="animate-pulse bg-white/20 h-6 w-12 rounded inline-block"></span> : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
