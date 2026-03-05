import { useRouter } from 'next/router';
import { Loader } from '@/components/ui/Loader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FiActivity as Activity, 
  FiLink as LinkIcon, 
  FiCheckCircle as CheckCircle2, 
  FiXCircle as XCircle, 
  FiBarChart2 as BarChart3 
} from 'react-icons/fi';
import { ActionMenu } from './ActionMenu';

export function QRTable({ loading, generatedQRs, onToggleStatus, onView, onDelete }) {
  const router = useRouter();
  const now = new Date();

  return (
    <Card className="bg-[#1A1A1A] border-white/10 shadow-lg">
      <CardHeader>
          <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-saas-orange" />
            Individual QR Scan Analytics
          </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : generatedQRs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">You haven't generated any QR codes yet.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-saas-orange text-white rounded-full font-medium hover:bg-[#E46A29] transition-colors"
            >
              Create Your First QR
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 pb-2 min-h-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#262626] text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">QR Code</th>
                  <th className="px-6 py-4 font-medium">Target URL / Content</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Date Created</th>
                  <th className="px-6 py-4 font-medium text-right">Scans</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#1A1A1A]">
                {generatedQRs.map((qr) => {
                  const isActive = qr.isActive !== false && (!qr.expiresAt || new Date(qr.expiresAt) > now);
                  return (
                    <tr key={qr._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white rounded flex-shrink-0 p-1">
                            <img src={qr.qrImage} alt="QR Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <span className="font-semibold text-white">{qr.label || "Untitled QR"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs truncate">
                          <LinkIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{qr.content}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isActive ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400">
                        {new Date(qr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-saas-orange" />
                          <span className="font-bold text-white text-base">{qr.scanCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ActionMenu 
                          qr={qr} 
                          onToggleStatus={onToggleStatus} 
                          onView={onView} 
                          onDelete={onDelete}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
