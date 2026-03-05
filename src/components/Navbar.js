import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export function Navbar({ isLoggedIn, handleLogout }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return router.pathname === path 
      ? "text-[14px] font-medium text-saas-orange transition-colors"
      : "text-[14px] font-medium text-gray-300 hover:text-white transition-colors";
  };

  return (
    <nav className="w-full bg-saas-black sticky top-0 z-50 py-4 border-b border-white/5">
      <div className="w-full max-w-7xl mx-auto px-4 min-h-[50px] flex items-center justify-between flex-wrap">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link href="/" className="flex items-center gap-2 mr-2">
            <img src="/logo.png" alt="Logo" className="w-full h-10 object-contain" />
            {/* <span className="font-bold text-saas-orange text-[22px] tracking-wide font-sans ml-1 uppercase">
              Free QR
            </span> */}
          </Link>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div className="lg:hidden flex items-center">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-white hover:text-saas-orange transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
                </svg>
            </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <Link href="/" className={isActive('/')}>
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/account" className={isActive('/account')}>
                Account
              </Link>
            </>
          )}
          <Link href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors">
            Blog
          </Link>
        </div>

        {/* Right Side: Auth (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="text-[14px] font-medium text-white border border-white/20 hover:bg-white/10 px-6 py-2 rounded-full transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-[14px] font-medium text-gray-300 hover:text-white px-2 py-2 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="text-[14px] font-medium text-white bg-saas-orange hover:bg-[#E46A29] px-6 py-2.5 rounded-full transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="w-full lg:hidden flex flex-col items-center gap-4 mt-4 pt-4 border-t border-white/10 pb-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/')}>
                    Home
                </Link>
                {isLoggedIn && (
                    <>
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/account')}>
                    Account
                    </Link>
                    </>
                )}
                <Link href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors">
                    Pricing
                </Link>
                <Link href="#" className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors">
                    Contact
                </Link>
                
                <div className="w-full border-t border-white/10 mt-2 pt-4 flex flex-col items-center gap-3">
                    {isLoggedIn ? (
                        <button 
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                        className="text-[14px] font-medium text-white border border-white/20 hover:bg-white/10 px-8 py-2 rounded-full transition-colors"
                        >
                        Logout
                        </button>
                    ) : (
                        <>
                        <Link 
                            href="/login" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/signup" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[14px] font-medium text-white bg-saas-orange hover:bg-[#E46A29] px-8 py-2.5 rounded-full transition-colors shadow-lg w-full text-center max-w-[200px]"
                        >
                            Get Started Free
                        </Link>
                        </>
                    )}
                </div>
            </div>
        )}
      </div>
    </nav>
  );
}
