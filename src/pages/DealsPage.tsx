import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, Clock, Filter, ChevronDown, X } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDeals } from '../context/DealsContext';

export default function DealsPage() {
  const { deals } = useDeals();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('Recommended');
  const maxPrice = useMemo(() => {
    if (deals.length === 0) return 1000;
    return Math.ceil(Math.max(...deals.map(d => d.dealPrice)));
  }, [deals]);

  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);

  // Update price range when max price changes
  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown') && !target.closest('.sort-dropdown')) {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDeals = useMemo(() => {
    let result = deals;

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.title.toLowerCase().includes(query) || 
        deal.brand.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (categoryFilter) {
      result = result.filter(deal => deal.category === categoryFilter);
    }

    // Price Filter
    result = result.filter(deal => deal.dealPrice >= priceRange[0] && deal.dealPrice <= priceRange[1]);

    // Sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.dealPrice - b.dealPrice;
        case 'Price: High to Low':
          return b.dealPrice - a.dealPrice;
        case 'Discount':
          // Extract percentage number from string "33% OFF"
          const discountA = parseInt(a.discount);
          const discountB = parseInt(b.discount);
          return discountB - discountA;
        case 'Rating':
          return b.rating - a.rating;
        default: // Recommended
          return 0;
      }
    });
  }, [categoryFilter, searchQuery, sortBy, priceRange]);

  const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Discount', 'Rating'];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : (categoryFilter ? `${categoryFilter} Deals` : 'All Deals')}
            </h1>
            <p className="text-slate-600">
              {searchQuery
                ? `Found ${filteredDeals.length} deals matching your search.`
                : (categoryFilter 
                  ? `Showing exclusive offers in ${categoryFilter}.` 
                  : 'Browse our complete collection of exclusive offers.')}
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0 items-center relative z-20">
            {(categoryFilter || searchQuery) && (
              <Link 
                to="/deals"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" /> Clear Filter
              </Link>
            )}
            
            {/* Filter Dropdown */}
            <div className="relative filter-dropdown">
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-slate-700 transition-colors ${isFilterOpen ? 'border-amber-500 text-amber-600 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-500 hover:text-amber-600'}`}
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-6 z-30">
                  <h3 className="font-semibold text-slate-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={maxPrice} 
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setPriceRange([0, maxPrice])}
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative sort-dropdown">
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-slate-700 transition-colors ${isSortOpen ? 'border-amber-500 text-amber-600 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-500 hover:text-amber-600'}`}
              >
                Sort by: {sortBy} <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-30">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${sortBy === option ? 'text-amber-600 font-medium bg-amber-50' : 'text-slate-700'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{deal.category}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{deal.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors h-12">
                    {deal.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-xl font-bold text-slate-900">${deal.dealPrice}</span>
                      <span className="ml-2 text-xs text-slate-400 line-through">${deal.originalPrice}</span>
                    </div>
                    <a 
                      href={deal.offerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-900 text-sm font-medium rounded-lg transition-colors"
                    >
                      Get Deal
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No deals found</h3>
            <p className="text-slate-600">We couldn't find any deals in this category.</p>
            <Link to="/deals" className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium">
              View all deals
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
