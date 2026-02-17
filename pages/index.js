import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [qrType, setQrType] = useState('text'); // 'text' or 'contact'
  
  // Contact State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');

  const [qrContent, setQrContent] = useState('');
  const [label, setLabel] = useState('');
  
  // New State Features
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState('');
  const [size, setSize] = useState(300);

  const [generatedQRs, setGeneratedQRs] = useState([]);
  const [loading, setLoading] = useState(false);
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
      
      if (qrType === 'contact') {
         finalContent = `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nFN:${contactName}\nORG:${contactOrg}\nTEL;TYPE=CELL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
      }

      const payload = { 
        content: finalContent, 
        label: label || (qrType === 'contact' ? `Contact: ${contactName}` : ''),
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
        setGeneratedQRs([data.data, ...generatedQRs]);
        // Reset form
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

  const templates = [
    { name: 'Classic', color: '#000000', bgColor: '#ffffff' },
    { name: 'Modern Dark', color: '#ffffff', bgColor: '#000000' },
    { name: 'Neon Blue', color: '#00FFFF', bgColor: '#000033' },
    { name: 'Nature', color: '#006400', bgColor: '#F0FFF0' },
    { name: 'Sunset', color: '#FF4500', bgColor: '#2B0000' },
  ];

  return (
    <div className="min-h-screen p-4">
      <Head>
        <title>QR Maker - Create Custom QR Codes</title>
        <meta name="description" content="Generate custom colored QR codes with logos instantly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 flex-grow">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10 shadow-xl h-fit sticky top-[100px]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Create New QR</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  
                  {/* QR Type Selector */}
                  <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQrType('text')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${qrType === 'text' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      URL / Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrType('contact')}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${qrType === 'contact' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      Contact Card
                    </button>
                  </div>

                  <div className="space-y-2">
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

                  {qrType === 'text' ? (
                    <div className="space-y-2">
                      <Label className="text-gray-300">Content</Label>
                      <Input
                        type="text"
                        placeholder="https://example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        value={qrContent}
                        onChange={(e) => setQrContent(e.target.value)}
                        required={qrType === 'text'}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                       <div className="space-y-2">
                          <Label className="text-gray-300">Full Name</Label>
                          <Input
                            placeholder="John Doe"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required={qrType === 'contact'}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-gray-300">Phone</Label>
                          <Input
                            placeholder="+1 234 567 8900"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-gray-300">Email</Label>
                          <Input
                            placeholder="john@example.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-gray-300">Organization</Label>
                          <Input
                            placeholder="Company Inc."
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                            value={contactOrg}
                            onChange={(e) => setContactOrg(e.target.value)}
                          />
                       </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Upload Logo (Optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setLogo(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Size (px)</Label>
                    <Input
                      type="number"
                      min="100"
                      max="1000"
                      placeholder="300"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Label (Optional)</Label>
                    <Input
                      type="text"
                      placeholder="My Website"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold">
                    {loading ? 'Generating...' : 'Generate QR'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* List Section */}
          <motion.div
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10 shadow-xl min-h-[500px]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Your QR Codes</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                   <p className="text-gray-400 text-center py-10">Please <Link href="/login" className="text-cyan-400 hover:underline">login</Link> to view your saved QR codes.</p>
                ) : generatedQRs.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">No QR codes generated yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {generatedQRs.map((qr, index) => (
                      <motion.div 
                        key={qr._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-xl p-4 flex flex-col items-center hover:bg-white/10 transition-colors border border-white/5"
                      >
                        <div className="relative inline-block mb-3 p-2 bg-white rounded-lg">
                            <img src={qr.qrImage} alt="QR Code" className="w-full h-auto rounded" />
                            {qr.logo && (
                              <img 
                                  src={qr.logo} 
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded bg-white p-0.5 object-cover"
                                  alt="Logo"
                              />
                            )}
                        </div>
                        <p className="font-bold text-white mb-1 truncate w-full text-center">{qr.label}</p>
                        <p className="text-xs text-gray-400 mb-3 truncate w-full text-center px-2">{qr.content}</p>
                        <div className="flex gap-2 w-full">
                            <a href={qr.qrImage} download={`qr-${qr.label}.png`} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 px-3 rounded text-center transition-colors border border-white/10">
                              Download
                            </a>
                            <button 
                              onClick={() => handleDelete(qr._id)}
                              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium py-2 px-3 rounded transition-colors border border-red-500/20"
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
        </div>

        <Footer />
      </div>
    </div>
  );
}
