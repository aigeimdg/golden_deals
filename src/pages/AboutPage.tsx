import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Users, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About <span className="text-amber-500">Golden Deal Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            We are on a mission to democratize access to premium deals. We believe that everyone deserves a golden opportunity to save on the things they love.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-amber-100 font-medium">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-amber-100 font-medium">Deals Curated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-amber-100 font-medium">Money Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-amber-100 font-medium">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Founded in 2023, Golden Deal Hub started as a small community of deal hunters sharing tips on a forum. As the community grew, so did our ambition. We realized that finding genuine, high-quality deals was harder than it should be.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Today, we partner directly with top brands to bring exclusive discounts to our members. Our team of expert curators verifies every deal to ensure it's truly "golden" before it reaches you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-amber-500" />
                  <span className="font-medium text-slate-900">Verified Deals</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-500" />
                  <span className="font-medium text-slate-900">Community Driven</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  <span className="font-medium text-slate-900">Premium Brands</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-amber-500" />
                  <span className="font-medium text-slate-900">Global Access</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-100 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Team meeting" 
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
