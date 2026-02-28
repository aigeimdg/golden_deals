import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Tag, Clock, ShieldCheck, Smartphone, Home, ShoppingBag, Gift } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Zap, color: 'bg-blue-100 text-blue-600', count: 120 },
  { name: 'Fashion', icon: Tag, color: 'bg-pink-100 text-pink-600', count: 85 },
  { name: 'Travel', icon: Clock, color: 'bg-green-100 text-green-600', count: 42 },
  { name: 'Home', icon: ShieldCheck, color: 'bg-amber-100 text-amber-600', count: 67 },
  { name: 'Mobiles', icon: Smartphone, color: 'bg-purple-100 text-purple-600', count: 94 },
  { name: 'Living', icon: Home, color: 'bg-orange-100 text-orange-600', count: 53 },
  { name: 'Accessories', icon: ShoppingBag, color: 'bg-teal-100 text-teal-600', count: 110 },
  { name: 'Gifts', icon: Gift, color: 'bg-red-100 text-red-600', count: 35 },
];

export default function CategoriesPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore our extensive collection of deals across various categories. Find exactly what you need at the best prices.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/deals?category=${encodeURIComponent(category.name)}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer h-full"
              >
                <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 border border-slate-100 group-hover:border-amber-200 h-full flex flex-col items-center justify-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {category.count} Deals
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
