import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function QRFormSection({ qrType, onNewQR }) {
  const router = useRouter();
  
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [qrContent, setQrContent] = useState('');
  const [label, setLabel] = useState('');
  
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState('');
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);

  const templates = [
    { name: 'Classic', color: '#000000', bgColor: '#ffffff' },
    { name: 'Modern Dark', color: '#ffffff', bgColor: '#000000' },
    { name: 'Neon Blue', color: '#00FFFF', bgColor: '#000033' },
    { name: 'Nature', color: '#006400', bgColor: '#F0FFF0' },
    { name: 'Sunset', color: '#FF4500', bgColor: '#2B0000' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return; 
    }

    setLoading(true);
    try {
      let finalContent = qrContent;
      
      if (qrType === 'vcard') {
         finalContent = `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nFN:${contactName}\nORG:${contactOrg}\nTEL;TYPE=CELL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
      }

      const payload = { 
        content: finalContent, 
        label: label || (qrType === 'vcard' ? `Contact: ${contactName}` : ''),
        color,
        bgColor,
        logo,
        size,
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onNewQR(data.data);
        setQrContent('');
        setContactName('');
        setContactPhone('');
        setContactEmail('');
        setContactOrg('');
        setLabel('');
        setLogo('');
        toast.success('QR Code generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate QR code');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
        <Card className="bg-white/5 border-white/10 shadow-xl h-fit ">
            <CardHeader>
            <CardTitle className="text-xl text-white">Create New QR</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2 mb-4">
                <Label className="text-gray-300">Templates</Label>
                <div className="flex gap-2 flex-wrap">
                    {templates.map((t) => (
                    <div 
                        key={t.name}
                        onClick={() => { setColor(t.color); setBgColor(t.bgColor); }}
                        className="cursor-pointer border border-white/20 rounded-md px-3 py-1 text-xs font-medium transition-transform hover:scale-105"
                        style={{ 
                        color: t.color === '#ffffff' ? '#000' : t.color, 
                        backgroundColor: t.bgColor === '#000000' ? '#fff' : t.bgColor,
                        background: `linear-gradient(135deg, ${t.bgColor} 50%, ${t.color} 50%)`,
                        color: 'white',
                        textShadow: '0 1px 2px black'
                        }}
                        title={t.name}
                    >
                        {t.name}
                    </div>
                    ))}
                </div>
                </div>

                {(qrType === 'website' || qrType === 'text') ? (
                <div className="space-y-2">
                    <Label className="text-gray-300">Content</Label>
                    <Input
                    type="text"
                    placeholder={qrType === 'website' ? "https://example.com" : "Enter your text here"}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    required
                    />
                </div>
                ) : qrType === 'vcard' ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Full Name</Label>
                            <Input
                            placeholder="John Doe"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required={qrType === 'vcard'}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">Phone</Label>
                            <Input
                            placeholder="+1 234 567 8900"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Email</Label>
                            <Input
                            placeholder="john@example.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">Organization</Label>
                            <Input
                            placeholder="Company Inc."
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={contactOrg}
                            onChange={(e) => setContactOrg(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                ) : (
                <div className="space-y-2 py-4">
                  <p className="text-gray-400 italic text-sm text-center">This feature is coming soon...</p>
                </div>
                )}
                
                {/* Row 1: Dot Color, Background, Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Dot Color</Label>
                        <div className="h-10 w-full rounded-md overflow-hidden bg-white/10 border border-white/20">
                        <input 
                            type="color" 
                            value={color} 
                            onChange={e => setColor(e.target.value)} 
                            className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Background</Label>
                        <div className="h-10 w-full rounded-md overflow-hidden bg-white/10 border border-white/20">
                        <input 
                            type="color" 
                            value={bgColor} 
                            onChange={e => setBgColor(e.target.value)} 
                            className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Size (px)</Label>
                        <Input
                            type="number"
                            min="100"
                            max="1000"
                            placeholder="300"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                    </div>
                </div>

                {/* Row 2: Upload Logo, Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Upload Logo (Optional)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 cursor-pointer h-10"
                            onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setLogo(reader.result);
                                reader.readAsDataURL(file);
                            }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Label (Optional)</Label>
                        <Input
                            type="text"
                            placeholder="My Website"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-10"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-saas-orange hover:bg-[#E46A29] text-white font-semibold rounded-[30px] h-12 mt-4 transition-colors border-none"
                >
                {loading ? 'Generating...' : 'Generate QR'}
                </Button>
            </form>
            </CardContent>
        </Card>
    </motion.div>
  );
}
