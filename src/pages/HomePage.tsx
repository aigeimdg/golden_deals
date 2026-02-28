import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, Tag, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeals } from '../context/DealsContext';
import { saveEmail } from '../utils/storage';

const categories = [
  { name: 'Electronics', icon: Zap, color: 'bg-blue-100 text-blue-600' },
  { name: 'Fashion', icon: Tag, color: 'bg-pink-100 text-pink-600' },
  { name: 'Travel', icon: Clock, color: 'bg-green-100 text-green-600' }, // Clock is placeholder
  { name: 'Home', icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' },
];

export default function HomePage() {
  const { deals } = useDeals();
  const featuredDeals = deals.slice(0, 6); // Show first 6 deals as featured
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Unlock Exclusive <span className="text-amber-500">Golden Deals</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Discover hand-picked offers from top brands. Save up to 70% on electronics, fashion, travel, and more. Join thousands of smart shoppers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/deals" 
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1"
              >
                Explore Deals <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Find exactly what you're looking for across our wide range of curated categories.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/deals?category=${encodeURIComponent(category.name)}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-slate-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow border border-slate-100 group-hover:border-amber-200">
                    <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform`}>
                      <category.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{category.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Golden Deals</h2>
              <p className="text-slate-600">Top-rated offers expiring soon.</p>
            </div>
            <Link to="/deals" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {deal.discount}
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{deal.brand}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{deal.rating}</span>
                      <span className="text-slate-400 font-normal">({deal.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {deal.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">${deal.dealPrice}</span>
                      <span className="ml-2 text-sm text-slate-400 line-through">${deal.originalPrice}</span>
                    </div>
                    <div className="flex items-center text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 mr-1" />
                      {deal.expiresIn} left
                    </div>
                  </div>
                  
                  <a 
                    href={deal.offerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-amber-500"
                  >
                    Get Deal <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-500/10 blur-3xl rounded-full -translate-x-1/3 translate-y-1/2"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Never Miss a Golden Deal</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join our exclusive community and get the best deals delivered straight to your inbox. No spam, just savings.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
