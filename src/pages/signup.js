import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token); // Simple auth storage
        toast.success('Account created successfully');
        router.push('/');
      } else {
        setError(data.message);
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong');
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-saas-black flex flex-col">
      <Head>
        <title>Sign Up - QR Maker</title>
        <meta name="description" content="Create a new QR Maker account." />
      </Head>
      
      <Navbar isLoggedIn={false} />

      <div className="flex-grow flex items-center justify-center p-4 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-[#1A1A1A] border-white/10 rounded-[16px] shadow-2xl p-2 lg:p-4">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-white">
                    Sign Up
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">Username</Label>
                        <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                        id="password"
                        type="password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-saas-orange hover:bg-[#E46A29] text-white font-bold rounded-[30px] h-12 transition-colors border-none mt-4">
                        Create Account
                    </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-saas-orange font-bold hover:underline transition-colors">
                        Login
                    </Link>
                    </p>
                </CardFooter>
                </Card>
            </motion.div>
        </div>

        <Footer />
    </div>
  );
}
