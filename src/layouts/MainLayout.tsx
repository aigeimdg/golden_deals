import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, ShoppingBag } from 'lucide-react';
import { saveEmail } from '../utils/storage';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const handleJoin = () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (saveEmail(email)) {
      alert('Thank you for subscribing! You have been added to our newsletter.');
    } else {
      alert('You are already subscribed!');
    }
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
                <img src="/logo.svg" alt="Golden Deal Hub" className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-amber-600 font-medium transition-colors" onClick={scrollToTop}>Home</Link>
              <Link to="/deals" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">Deals</Link>
              <Link to="/categories" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">Categories</Link>
              <Link to="/about" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">About Us</Link>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search deals..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/deals?search=${encodeURIComponent(e.currentTarget.value)}`;
                    }
                  }}
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50" onClick={scrollToTop}>Home</Link>
              <Link to="/deals" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50">Deals</Link>
              <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50">Categories</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-amber-600 hover:bg-slate-50">About Us</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="Golden Deal Hub" className="h-12 w-auto" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your premier destination for exclusive deals, discounts, and golden opportunities. Save big on top brands and services.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-amber-400 transition-colors" onClick={scrollToTop}>Home</Link></li>
                <li><Link to="/deals" className="hover:text-amber-400 transition-colors">Latest Deals</Link></li>
                <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Categories</Link></li>
                <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Admin</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest golden deals.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={handleJoin}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Golden Deal Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
